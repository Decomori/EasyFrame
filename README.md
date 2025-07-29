# 🎬 EasyFrame

YouTube와 Vimeo 비디오를 위한 임베드 코드를 쉽게 생성하는 웹 애플리케이션입니다.

## ✨ 주요 기능

- **YouTube & Vimeo 지원**: 두 플랫폼의 비디오 URL을 모두 지원합니다
- **실시간 미리보기**: 생성된 코드의 실제 모습을 바로 확인할 수 있습니다
- **다양한 옵션**: 자동재생, 음소거, 컨트롤 숨기기 등 다양한 설정을 제공합니다
- **반응형 디자인**: 모바일과 데스크톱에서 모두 최적화된 사용자 경험을 제공합니다
- **원클릭 복사**: 생성된 코드를 클릭 한 번으로 클립보드에 복사할 수 있습니다

## 🚀 사용법

1. **비디오 URL 입력**: YouTube 또는 Vimeo 비디오 URL을 입력합니다
2. **옵션 설정**: 원하는 재생 옵션을 선택합니다
   - 자동재생: 페이지 로드 시 자동으로 재생됩니다
   - 음소거: 기본적으로 음소거 상태로 재생됩니다
   - 컨트롤 숨기기: 재생 컨트롤과 정보를 숨깁니다
   - 관련 동영상 숨기기: 관련 동영상 추천을 숨깁니다
3. **크기 설정**: 원하는 너비와 높이를 설정하거나 프리셋 크기를 선택합니다
4. **코드 생성**: "코드 생성" 버튼을 클릭하여 임베드 코드를 생성합니다
5. **복사 및 사용**: 생성된 코드를 복사하여 웹사이트에 붙여넣습니다

## 📱 지원하는 URL 형식

### YouTube
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`

### Vimeo
- `https://vimeo.com/VIDEO_ID`
- `https://vimeo.com/video/VIDEO_ID`
- `https://player.vimeo.com/video/VIDEO_ID`

## 🛠️ 기술 스택

- **HTML5**: 시맨틱 마크업
- **CSS3**: 현대적인 스타일링과 반응형 디자인
- **JavaScript (ES6+)**: 인터랙티브 기능 구현
- **Google Fonts**: Inter 폰트 사용

## 📦 설치 및 실행

### 로컬 개발 환경

1. 저장소를 클론합니다:
```bash
git clone https://github.com/yourusername/EasyFrame.git
cd EasyFrame
```

2. 웹 서버를 실행합니다:
```bash
# Python 3
python -m http.server 8000

# 또는 Node.js (http-server 설치 필요)
npx http-server

# 또는 PHP
php -S localhost:8000
```

3. 브라우저에서 `http://localhost:8000`을 열어 확인합니다.

### GitHub Pages 배포

1. GitHub 저장소에 코드를 푸시합니다
2. 저장소 설정에서 GitHub Pages를 활성화합니다
3. `main` 브랜치의 루트 디렉토리를 소스로 선택합니다

## 🎨 커스터마이징

### 색상 변경
`styles.css` 파일에서 CSS 변수를 수정하여 색상을 변경할 수 있습니다:

```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --success-color: #10b981;
  --error-color: #ef4444;
}
```

### 기능 추가
`script.js` 파일에서 새로운 기능을 추가할 수 있습니다:

```javascript
// 새로운 옵션 추가 예시
function addCustomOption() {
  // 구현 코드
}
```

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🙏 감사의 말

- [YouTube Embed API](https://developers.google.com/youtube/iframe_api_reference)
- [Vimeo Player API](https://developer.vimeo.com/player/sdk)
- [Google Fonts](https://fonts.google.com/) - Inter 폰트

## 📞 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 [이슈](https://github.com/yourusername/EasyFrame/issues)를 생성해주세요.

---

**EasyFrame**으로 더 쉽고 빠르게 비디오 임베드 코드를 생성하세요! 🎬✨