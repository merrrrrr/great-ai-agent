import React from 'react';

const ContentPreview = ({ content }) => {
  if (!content) {
    return (
      <div className="content-preview">
        <h2>Content Preview 📱</h2>
        <div className="preview-container">
          <div className="preview-header">Instagram Post Preview</div>
          <div className="preview-content">
            <p style={{color: '#999', textAlign: 'center', padding: '2rem'}}>
              Generate a campaign to see preview here
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-preview">
      <h2>Content Preview 📱</h2>
      
      {/* Instagram Style Preview */}
      <div className="preview-container">
        <div className="preview-header">
          📸 {content.platform || 'Instagram'} Post
        </div>
        <div className="preview-content">
          {content.imageUrl && (
            <img 
              src={content.imageUrl} 
              alt="Generated content" 
              style={{width: '100%', borderRadius: '8px', marginBottom: '1rem'}}
            />
          )}
          
          <div style={{marginBottom: '1rem'}}>
            <strong>Caption:</strong>
            <p style={{marginTop: '0.5rem', lineHeight: '1.5'}}>
              {content.caption}
            </p>
          </div>
          
          {content.hashtags && (
            <div style={{marginBottom: '1rem'}}>
              <strong>Hashtags:</strong>
              <p style={{marginTop: '0.5rem', color: '#1877f2'}}>
                {content.hashtags.join(' ')}
              </p>
            </div>
          )}
          
          {content.voiceoverUrl && (
            <div>
              <strong>Voiceover:</strong>
              <audio controls style={{width: '100%', marginTop: '0.5rem'}}>
                <source src={content.voiceoverUrl} type="audio/mpeg" />
              </audio>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentPreview;