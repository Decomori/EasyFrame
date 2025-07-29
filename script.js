// DOM 요소들
const videoUrlInput = document.getElementById('videoUrl');
const autoplayCheckbox = document.getElementById('autoplay');
const muteCheckbox = document.getElementById('mute');
const hideControlsCheckbox = document.getElementById('hideControls');
const hideRelatedCheckbox = document.getElementById('hideRelated');
const loopCheckbox = document.getElementById('loop');
const widthInput = document.getElementById('width');
const customWidthInput = document.getElementById('customWidth');
const customHeightInput = document.getElementById('customHeight');
const startTimeInput = document.getElementById('startTime');
const endTimeInput = document.getElementById('endTime');
const generateBtn = document.getElementById('generateBtn');
const embedCodeTextarea = document.getElementById('embedCode');
const copyBtn = document.getElementById('copyBtn');
const resultSection = document.getElementById('resultSection');
const previewContainer = document.getElementById('preview');
const toast = document.getElementById('toast');

// 현재 설정 상태
let currentSettings = {
  width: '100%',
  ratio: '16:9',
  align: 'center'
};

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
  if (options.hideControls) {
    params.append('controls', '0');
    params.append('showinfo', '0');
    params.append('disablekb', '1'); // 키보드 컨트롤 비활성화
    params.append('fs', '0'); // 전체화면 버튼 숨기기
  }
  if (options.hideRelated) params.append('rel', '0');
  if (options.loop) {
    params.append('loop', '1');
    params.append('playlist', videoId); // YouTube에서 loop를 위해서는 playlist 파라미터도 필요
  }
  if (options.startTime) params.append('start', options.startTime.toString());
  if (options.endTime) params.append('end', options.endTime.toString());
  
  // 기본 설정
  params.append('playsinline', '1');
  // modestbranding은 지원 중단됨 - 제거
  
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  return params.toString() ? `${embedUrl}?${params.toString()}` : embedUrl;
}

// Vimeo 임베드 URL 생성
function generateVimeoEmbedURL(videoId, options) {
  const params = new URLSearchParams();
  
  if (options.autoplay) params.append('autoplay', '1');
  if (options.mute) params.append('muted', '1');
  if (options.hideControls) params.append('controls', '0');
  if (options.loop) params.append('loop', '1');
  
  // 기본 설정
  params.append('title', '0');
  params.append('byline', '0');
  params.append('portrait', '0');
  
  let embedUrl = `https://player.vimeo.com/video/${videoId}`;
  
  // Vimeo 시간 파라미터는 URL 끝에 추가
  let timeParam = '';
  if (options.startTime) {
    timeParam = `#t=${options.startTime}s`;
    if (options.endTime) {
      timeParam += `,${options.endTime}s`;
    }
  } else if (options.endTime) {
    timeParam = `#t=0s,${options.endTime}s`;
  }
  
  const queryString = params.toString();
  if (queryString) {
    embedUrl += '?' + queryString;
  }
  if (timeParam) {
    embedUrl += timeParam;
  }
  
  return embedUrl;
}

// iframe 코드 생성
function generateIframeCode(embedUrl, settings) {
  const { width, ratio, align } = settings;
  
  // 정렬 스타일 결정
  let alignStyle = '';
  switch (align) {
    case 'left':
      alignStyle = 'margin: 0 auto 0 0;';
      break;
    case 'right':
      alignStyle = 'margin: 0 0 0 auto;';
      break;
    default: // center
      alignStyle = 'margin: 0 auto;';
  }
  
  // 반응형 방식 (auto, 100%, 1200px, custom)
  if (width !== 'custom' || ratio !== 'custom') {
    let maxWidth = '1200px';
    let paddingRatio = '56.25%'; // 16:9 기본
    
    // 너비 설정
    if (width === '100%') {
      maxWidth = '100%';
    } else if (width === 'auto') {
      maxWidth = 'auto'; // 설정 안함
    } else if (widthInput.value) {
      maxWidth = widthInput.value;
    }
    
    // 비율 설정
    switch (ratio) {
      case '16:10':
        paddingRatio = '62.5%'; // 10÷16×100
        break;
      case '4:3':
        paddingRatio = '75%';
        break;
      case '1:1':
        paddingRatio = '100%';
        break;
      default: // 16:9
        paddingRatio = '56.25%';
    }
    
    const widthStyle = `max-width: ${maxWidth}; `;
    return `<div style="${widthStyle}${alignStyle}">
  <div style="padding:${paddingRatio} 0 0 0; position:relative;">
    <iframe src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position:absolute; top:0; left:0; width:100%; height:100%;"></iframe>
  </div>
</div>`;
  }
  
  // 자유 비율 방식 (수동 입력)
  const customWidth = customWidthInput.value || '560';
  const customHeight = customHeightInput.value || '315';
  
  return `<div style="${alignStyle}">
  <iframe width="${customWidth}" height="${customHeight}" src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>`;
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

// 너비 설정 버튼 이벤트
document.querySelectorAll('.width-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const width = btn.dataset.width;
    
    // 활성 상태 변경
    document.querySelectorAll('.width-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // 수동 입력 표시/숨김
    const customInput = document.getElementById('customWidthInput');
    if (width === 'custom') {
      customInput.style.display = 'block';
      widthInput.focus();
    } else {
      customInput.style.display = 'none';
      // 'none'을 'auto'로 변환
      currentSettings.width = width === 'none' ? 'auto' : width;
    }
  });
});

// 비율 설정 버튼 이벤트
document.querySelectorAll('.ratio-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const ratio = btn.dataset.ratio;
    
    // 활성 상태 변경
    document.querySelectorAll('.ratio-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // 수동 입력 표시/숨김
    const customInput = document.getElementById('customRatioInput');
    if (ratio === 'custom') {
      customInput.style.display = 'block';
      customWidthInput.focus();
    } else {
      customInput.style.display = 'none';
      currentSettings.ratio = ratio;
    }
  });
});

// 정렬 설정 버튼 이벤트
document.querySelectorAll('.align-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const align = btn.dataset.align;
    
    // 활성 상태 변경
    document.querySelectorAll('.align-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    currentSettings.align = align;
  });
});

// 코드 생성 버튼 이벤트
generateBtn.addEventListener('click', () => {
  const url = videoUrlInput.value.trim();
  
  if (!validateURL(url)) return;
  
  const options = {
    autoplay: autoplayCheckbox.checked,
    mute: muteCheckbox.checked,
    hideControls: hideControlsCheckbox.checked,
    hideRelated: hideRelatedCheckbox.checked,
    loop: loopCheckbox.checked,
    startTime: startTimeInput.value ? parseInt(startTimeInput.value) : null,
    endTime: endTimeInput.value ? parseInt(endTimeInput.value) : null
  };
  
  // 현재 설정 가져오기
  const settings = {
    width: currentSettings.width,
    ratio: currentSettings.ratio,
    align: currentSettings.align
  };
  
  // 수동 입력 값 처리
  if (settings.width === 'custom' && widthInput.value) {
    settings.width = widthInput.value;
  }
  if (settings.ratio === 'custom') {
    settings.ratio = 'custom';
  }
  
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
  const iframeCode = generateIframeCode(embedUrl, settings);
  
  // 결과 표시
  embedCodeTextarea.value = iframeCode;
  previewContainer.innerHTML = iframeCode;
  
  // 컨트롤 숨기기 옵션에 따라 CSS 클래스 추가
  if (options.hideControls) {
    previewContainer.classList.add('controls-hidden');
  } else {
    previewContainer.classList.remove('controls-hidden');
  }
  
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

// 수동 입력 필드 이벤트
widthInput.addEventListener('input', () => {
  if (widthInput.value) {
    currentSettings.width = widthInput.value;
  }
});

customWidthInput.addEventListener('input', () => {
  if (customWidthInput.value && customHeightInput.value) {
    currentSettings.ratio = 'custom';
  }
});

customHeightInput.addEventListener('input', () => {
  if (customWidthInput.value && customHeightInput.value) {
    currentSettings.ratio = 'custom';
  }
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