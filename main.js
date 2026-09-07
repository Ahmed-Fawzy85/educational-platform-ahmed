// ================= بيانات المواد والمجلدات =================
const gradeData = {
  grade1: {
    title: "الصف الأول الثانوي",
    driveFolderId: "1RnWUt-ZLebrfpfWFzkQjI_TL3nmhlctc", 
    // رابط قائمة تشغيل الصف الأول على قناتك (يمكنك تغييره لرابط الـ playlist المباشر لاحقاً)
    playlistUrl: "https://www.youtube.com/@MR.ahmed_fawzy/playlists",
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
    driveFolderId: "1ocZmlCXz2j9T8MV6vF_2JF3ZxFAm6BQb",
    // رابط قائمة تشغيل الصف الثاني على قناتك
    playlistUrl: "https://www.youtube.com/@MR.ahmed_fawzy/playlists",
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

  // عرض زر كارت قائمة التشغيل لليوتيوب بدلاً من المشغل القديم
  const videoContainer = document.getElementById('video-list');
  videoContainer.innerHTML = `
    <div style="text-align: center; padding: 40px 20px; width: 100%; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
      <div style="font-size: 3.5rem; color: #dc2626; margin-bottom: 15px;">
        <i class="fa-brands fa-youtube"></i>
      </div>
      <h3 style="font-size: 1.3rem; color: #0f172a; margin-bottom: 10px; font-weight: bold;">
        قائمة محاضرات وشروحات ${data.title}
      </h3>
      <p style="color: #64748b; font-size: 0.95rem; margin-bottom: 25px; line-height: 1.6;">
        اضغط على الزر لمشاهدة جميع فيديوهات الشرح والمراجعات بالترتيب على القناة الرسمية
      </p>
      <a href="${data.playlistUrl}" target="_blank" style="
        display: inline-flex;
        align-items: center;
        gap: 10px;
        background: #dc2626;
        color: #ffffff;
        padding: 12px 28px;
        border-radius: 12px;
        font-weight: bold;
        font-size: 1rem;
        text-decoration: none;
        box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
        transition: 0.2s;
      ">
        <i class="fa-solid fa-play"></i>
        <span>فتح قائمة الفيديوهات على YouTube</span>
      </a>
    </div>
  `;

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
