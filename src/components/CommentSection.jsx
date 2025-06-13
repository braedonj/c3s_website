import { useState, useEffect } from 'react';
import styles from './CommentSection.module.css';

function CommentSection({ slug, isAdmin = false }) {
  const API_BASE_URL = 'http://localhost:3001/api/comments';
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newText, setNewText] = useState('');
  const [visibleCount, setVisibleCount] = useState(3);

  const [replyingTo, setReplyingTo] = useState(null);
  const [replyAuthor, setReplyAuthor] = useState('');
  const [replyText, setReplyText] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const handleAddComment = async () => {
    if (!newAuthor.trim() || !newText.trim()) return;
    const newComment = {
      author: newAuthor.trim(),
      text: newText.trim(),
      parent_id: null,
      article_slug: slug,
    };

    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newComment),
    });

    const savedComment = await res.json();
    setComments([savedComment, ...comments]);
    setNewAuthor('');
    setNewText('');
    setShowForm(false);
  };

  const handleAddReply = async (parentId) => {
    if (!replyAuthor.trim() || !replyText.trim()) return;
    const newReply = {
      author: replyAuthor.trim(),
      text: replyText.trim(),
      parent_id: parentId,
      article_slug: slug,
    };

    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReply),
    });

    const savedReply = await res.json();
    setComments([...comments, savedReply]);
    setReplyingTo(null);
    setReplyAuthor('');
    setReplyText('');
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyAuthor('');
    setReplyText('');
  };

  const handleDeleteComment = async (commentId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:3001/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': import.meta.env.VITE_ADMIN_SECRET,
        },
      });

      if (!res.ok) throw new Error('Failed to delete comment');
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete comment.');
    }
  };

const handleLike = async (commentId) => {
  const likedKey = `liked_comment_${commentId}`;
  const hasLiked = localStorage.getItem(likedKey);

  try {
    const url = `${API_BASE_URL}/${commentId}/${hasLiked ? 'unlike' : 'like'}`;
    const res = await fetch(url, {
      method: 'POST',
    });

    if (!res.ok) throw new Error(`Failed to ${hasLiked ? 'unlike' : 'like'} comment`);

    setComments(comments.map(c =>
      c.id === commentId
        ? { ...c, likes: (c.likes || 0) + (hasLiked ? -1 : 1) }
        : c
    ));

    if (hasLiked) {
      localStorage.removeItem(likedKey);
    } else {
      localStorage.setItem(likedKey, 'true');
    }
  } catch (err) {
    console.error('Like toggle error:', err);
  }
};



  const renderComment = (comment, isReply = false) => {
    const children = comments
      .filter(c => String(c.parent_id) === String(comment.id))
      .map(reply => renderComment(reply, true));

    return (
      <div key={comment.id} className={isReply ? styles.reply : styles.comment}>
        <p><strong>{comment.author}</strong></p>
        <p>{comment.text}</p>
        <div className={styles.actions}>
          <button
              onClick={() => handleLike(comment.id)}
              style={{
                fontWeight: localStorage.getItem(`liked_comment_${comment.id}`) ? 'bold' : 'normal',
              }}>👍 {comment.likes || 0}
          </button>
          {isAdmin && (
            <button onClick={() => {
              setCommentToDelete(comment.id);
              setShowDeleteModal(true);
            }}>🗑️ Delete</button>
          )}
          <button onClick={() => setReplyingTo(comment.id)}>💬 Reply</button>
        </div>

        {replyingTo === comment.id && (
          <div className={styles.replyForm}>
            <input
              type="text"
              placeholder="Your name"
              value={replyAuthor}
              onChange={(e) => setReplyAuthor(e.target.value)}
            />
            <textarea
              placeholder="Write your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <div className={styles.buttonRow}>
              <button onClick={() => handleAddReply(comment.id)}>Submit</button>
              <button onClick={handleCancelReply} className={styles.cancelButton}>Cancel</button>
            </div>
          </div>
        )}
        {children}
      </div>
    );
  };

  const topLevelComments = comments.filter(c => c.parent_id === null);

  useEffect(() => {
    fetch(`${API_BASE_URL}?slug=${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setComments(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching comments:', err);
        setComments([]);
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    const handleGlobalEscape = (e) => {
      if (e.key === 'Escape') {
        setShowForm(false);
        setNewAuthor('');
        setNewText('');
        setReplyingTo(null);
        setReplyAuthor('');
        setReplyText('');
        setShowDeleteModal(false);
        setCommentToDelete(null);
      }
    };
    document.addEventListener('keydown', handleGlobalEscape);
    return () => document.removeEventListener('keydown', handleGlobalEscape);
  }, []);

  return (
    <div className={styles.commentSection}>
      <button
        onClick={() => {
          if (showForm) {
            // Reset form when canceling
            setNewAuthor('');
            setNewText('');
          }
          setShowForm(!showForm);
        }}
        className={styles.addCommentBtn}
      >
        {showForm ? 'Cancel' : 'Add Comment'}
      </button>

      {showForm && (
        <div className={styles.addCommentForm}>
          <input
            type="text"
            placeholder="Your name"
            value={newAuthor}
            onChange={(e) => setNewAuthor(e.target.value)}
          />
          <textarea
            placeholder="Write your comment..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
          <button onClick={handleAddComment}>Submit</button>
        </div>
      )}

      <h3>Comments</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {topLevelComments.slice(0, visibleCount).map(comment => renderComment(comment))}
          {visibleCount < topLevelComments.length && (
            <button className={styles.viewMore} onClick={() => setVisibleCount(visibleCount + 3)}>
              View More Comments →
            </button>
          )}
        </>
      )}

      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <p>Are you sure you want to delete this comment?</p>
            <div className={styles.modalActions}>
              <button onClick={async () => {
                try {
                  const res = await fetch(`http://localhost:3001/api/comments/${commentToDelete}`, {
                    method: 'DELETE',
                    headers: {
                      'x-admin-secret': import.meta.env.VITE_ADMIN_SECRET,
                    },
                  });

                  if (!res.ok) throw new Error('Failed to delete');
                  setComments(comments.filter(c => c.id !== commentToDelete));
                } catch (err) {
                  console.error('Delete failed:', err);
                  alert('Error deleting comment.');
                } finally {
                  setShowDeleteModal(false);
                  setCommentToDelete(null);
                }
              }}>Delete</button>
              <button onClick={() => {
                setShowDeleteModal(false);
                setCommentToDelete(null);
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommentSection;
