// DOM 요소들
const videoUrlInput = document.getElementById('videoUrl');
const autoplayCheckbox = document.getElementById('autoplay');
const muteCheckbox = document.getElementById('mute');
const hideControlsCheckbox = document.getElementById('hideControls');
const hideRelatedCheckbox = document.getElementById('hideRelated');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const generateBtn = document.getElementById('generateBtn');
const embedCodeTextarea = document.getElementById('embedCode');
const copyBtn = document.getElementById('copyBtn');
const resultSection = document.getElementById('resultSection');
const previewContainer = document.getElementById('preview');
const toast = document.getElementById('toast');

// YouTube ID 추출 함수
function extractYouTubeID(url) {
  const patterns = [
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|vi|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([\w-]{11})/,
    /youtube\.com\/embed\/([\w-]{11})/,
    /youtube\.com\/v\/([\w-]{11})/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Vimeo ID 추출 함수
function extractVimeoID(url) {
  const patterns = [
    /vimeo\.com\/(?:video\/)?(\d+)/,
    /vimeo\.com\/embed\/(\d+)/,
    /player\.vimeo\.com\/video\/(\d+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// URL 유효성 검사
function validateURL(url) {
  if (!url.trim()) {
    showToast('비디오 URL을 입력해주세요.', 'error');
    return false;
  }
  
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
  const isVimeo = url.includes('vimeo.com');
  
  if (!isYouTube && !isVimeo) {
    showToast('YouTube 또는 Vimeo URL을 입력해주세요.', 'error');
    return false;
  }
  
  return true;
}

// YouTube 임베드 URL 생성
function generateYouTubeEmbedURL(videoId, options) {
  const params = new URLSearchParams();
  
  if (options.autoplay) params.append('autoplay', '1');
  if (options.mute) params.append('mute', '1');
  if (options.hideControls) params.append('controls', '0');
  if (options.hideRelated) params.append('rel', '0');
  
  // 기본 설정
  params.append('playsinline', '1');
  params.append('modestbranding', '1');
  
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  return params.toString() ? `${embedUrl}?${params.toString()}` : embedUrl;
}

// Vimeo 임베드 URL 생성
function generateVimeoEmbedURL(videoId, options) {
  const params = new URLSearchParams();
  
  if (options.autoplay) params.append('autoplay', '1');
  if (options.mute) params.append('muted', '1');
  if (options.hideControls) params.append('controls', '0');
  
  // 기본 설정
  params.append('title', '0');
  params.append('byline', '0');
  params.append('portrait', '0');
  
  const embedUrl = `https://player.vimeo.com/video/${videoId}`;
  return params.toString() ? `${embedUrl}?${params.toString()}` : embedUrl;
}

// iframe 코드 생성
function generateIframeCode(embedUrl, width, height) {
  return `<iframe width="${width}" height="${height}" src="${embedUrl}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
}

// 토스트 메시지 표시
function showToast(message, type = 'success') {
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// 코드 복사 기능
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('코드가 클립보드에 복사되었습니다!');
    
    // 복사 버튼 상태 변경
    const copyText = copyBtn.querySelector('.copy-text');
    const copyIcon = copyBtn.querySelector('.copy-icon');
    
    copyBtn.classList.add('copied');
    copyText.textContent = '복사됨';
    copyIcon.textContent = '✅';
    
    setTimeout(() => {
      copyBtn.classList.remove('copied');
      copyText.textContent = '복사';
      copyIcon.textContent = '📋';
    }, 2000);
  } catch (err) {
    showToast('복사에 실패했습니다. 수동으로 복사해주세요.', 'error');
  }
}

// 프리셋 크기 버튼 이벤트
document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const width = btn.dataset.width;
    const height = btn.dataset.height;
    
    widthInput.value = width;
    heightInput.value = height;
    
    // 활성 상태 변경
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// 기본 프리셋 활성화
document.querySelector('[data-width="560"]').classList.add('active');

// 코드 생성 버튼 이벤트
generateBtn.addEventListener('click', () => {
  const url = videoUrlInput.value.trim();
  
  if (!validateURL(url)) return;
  
  const options = {
    autoplay: autoplayCheckbox.checked,
    mute: muteCheckbox.checked,
    hideControls: hideControlsCheckbox.checked,
    hideRelated: hideRelatedCheckbox.checked
  };
  
  const width = widthInput.value || 560;
  const height = heightInput.value || 315;
  
  let embedUrl = '';
  let videoId = '';
  
  // YouTube 처리
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    videoId = extractYouTubeID(url);
    if (!videoId) {
      showToast('올바른 YouTube URL이 아닙니다.', 'error');
      return;
    }
    embedUrl = generateYouTubeEmbedURL(videoId, options);
  }
  // Vimeo 처리
  else if (url.includes('vimeo.com')) {
    videoId = extractVimeoID(url);
    if (!videoId) {
      showToast('올바른 Vimeo URL이 아닙니다.', 'error');
      return;
    }
    embedUrl = generateVimeoEmbedURL(videoId, options);
  }
  
  // iframe 코드 생성
  const iframeCode = generateIframeCode(embedUrl, width, height);
  
  // 결과 표시
  embedCodeTextarea.value = iframeCode;
  previewContainer.innerHTML = iframeCode;
  resultSection.style.display = 'block';
  
  // 결과 섹션으로 스크롤
  resultSection.scrollIntoView({ behavior: 'smooth' });
  
  showToast('임베드 코드가 생성되었습니다!');
});

// 복사 버튼 이벤트
copyBtn.addEventListener('click', () => {
  const code = embedCodeTextarea.value;
  if (code) {
    copyToClipboard(code);
  }
});

// Enter 키로 코드 생성
videoUrlInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    generateBtn.click();
  }
});

// 입력 필드 유효성 검사
widthInput.addEventListener('input', () => {
  const value = parseInt(widthInput.value);
  if (value < 200) widthInput.value = 200;
  if (value > 1200) widthInput.value = 1200;
});

heightInput.addEventListener('input', () => {
  const value = parseInt(heightInput.value);
  if (value < 150) heightInput.value = 150;
  if (value > 800) heightInput.value = 800;
});

// 자동재생과 음소거 연동
autoplayCheckbox.addEventListener('change', () => {
  if (autoplayCheckbox.checked && !muteCheckbox.checked) {
    muteCheckbox.checked = true;
    showToast('자동재생을 위해 음소거가 활성화되었습니다.');
  }
});

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  // URL 입력 필드에 포커스
  videoUrlInput.focus();
  
  // 예시 URL 표시 (개발용)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    videoUrlInput.placeholder = '예: https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  }
});

// PWA 지원을 위한 서비스 워커 등록 (선택사항)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
} 