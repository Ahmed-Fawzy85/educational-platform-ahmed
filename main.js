// ================= بيانات المواد والمجلدات =================
// ضع معرفات مجلدات Google Drive الخاصة بك ومقاطع اليوتيوب هنا
const gradeData = {
  grade1: {
    title: "الصف الأول الثانوي",
    // استبدل النص التالي بمعرف مجلد درايف للصف الأول (Folder ID)
    driveFolderId: "1RnWUt-ZLebrfpfWFzkQjI_TL3nmhlctc", 
    videos: [
      { title: "المحاضرة الأولى: مقدمة البرمجة والتفكير المنطقي", youtubeId: "dQw4w9WgXcQ" }
    ],
    instructions: `
      <h3 style="color: #1e3a8a; margin-bottom: 12px;">📌 تعليمات ومواعيد الصف الأول الثانوي:</h3>
      <ul style="margin-right: 20px; line-height: 2;">
        <li>الحصص الأسبوعية: الأحد والأربعاء الساعة 5:00 مساءً.</li>
        <li>الواجبات والتطبيقات العملية يتم استلامها من قسم الملازم (PDF).</li>
        <li>أي استفسار يرجى التواصل فوراً على جروب الواتساب الخاص بالدفعة.</li>
      </ul>
    `
  },
  grade2: {
    title: "الصف الثاني الثانوي",
    // استبدل النص التالي بمعرف مجلد درايف للصف الثاني (Folder ID)
    driveFolderId: "1ocZmlCXz2j9T8MV6vF_2JF3ZxFAm6BQb",
    videos: [
      { title: "المحاضرة الأولى: مراجعة الأساسيات والذكاء الاصطناعي", youtubeId: "dQw4w9WgXcQ" }
    ],
    instructions: `
      <h3 style="color: #1e3a8a; margin-bottom: 12px;">📌 تعليمات ومواعيد الصف الثاني الثانوي:</h3>
      <ul style="margin-right: 20px; line-height: 2;">
        <li>الحصص الأسبوعية: الإثنين والخميس الساعة 6:30 مساءً.</li>
        <li>الملازم المحدثة وكشوفات التقييم ترفع باستمرار داخل قسم الـ PDF.</li>
      </ul>
    `
  }
};

// ================= دوال التحكم في الواجهة =================

// الانتقال إلى مرحلة معينة
function openGrade(gradeKey, gradeTitle) {
  const data = gradeData[gradeKey];
  if (!data) return;

  document.getElementById('home-view').classList.remove('active');
  document.getElementById('grade-view').classList.add('active');

  document.getElementById('current-grade-title').innerText = gradeTitle;

  // تضمين مجلد درايف
  const driveUrl = `https://drive.google.com/embeddedfolderview?id=${data.driveFolderId}#grid`;
  document.getElementById('drive-frame').src = driveUrl;

  // تعبئة فيديوهات اليوتيوب
  const videoContainer = document.getElementById('video-list');
  videoContainer.innerHTML = '';
  data.videos.forEach(vid => {
    videoContainer.innerHTML += `
      <div class="video-item">
        <iframe src="https://www.youtube.com/embed/${vid.youtubeId}" frameborder="0" allowfullscreen></iframe>
        <p>${vid.title}</p>
      </div>
    `;
  });

  // تعبئة التعليمات
  document.getElementById('instructions-text').innerHTML = data.instructions;

  // تفعيل تبويب الـ PDF أولاً كافتراضي
  const tabs = document.querySelectorAll('.section-card');
  switchContent('pdf-box', tabs[0]);
}

// العودة للصفحة الرئيسية
function goHome() {
  document.getElementById('grade-view').classList.remove('active');
  document.getElementById('home-view').classList.add('active');
  document.getElementById('drive-frame').src = "";
}

// التبديل بين التبويبات (ملازم / فيديوهات / تعليمات)
function switchContent(contentId, clickedCard) {
  document.querySelectorAll('.section-card').forEach(card => card.classList.remove('active'));
  if (clickedCard) clickedCard.classList.add('active');

  document.querySelectorAll('.content-tab').forEach(tab => tab.classList.remove('active'));
  document.getElementById(contentId).classList.add('active');
}