// تفعيل محرر CodeMirror الاحترافي
const editorElement = document.getElementById('codeEditor');
const codeEditor = CodeMirror.fromTextArea(editorElement, {
    lineNumbers: true,
    theme: 'dracula',
    mode: 'python',
    indentUnit: 4,
    autoCloseBrackets: true,  // إغلاق الأقواس وعلامات التنصيص تلقائياً
    matchBrackets: true,       // تلوين الأقواس المتطابقة
    lineWrapping: true
});

const runBtn = document.getElementById('runBtn');
const downloadBtn = document.getElementById('downloadBtn');
const clearBtn = document.getElementById('clearBtn');
const outputArea = document.getElementById('output');
const webOutput = document.getElementById('webOutput');
const languageSelect = document.getElementById('languageSelect');
const warningMessage = document.getElementById('warningMessage');

// دالة الفحص الذكي للغات والتنبيهات
function checkLanguage() {
    const code = codeEditor.getValue();
    const lang = languageSelect.value;
    let warning = "";

    const pythonWords = /\b(print\(|def |import |elif |input\(|while True:)\b/;
    const jsWords = /\b(console\.log|let |const |document\.|function |alert\(|prompt\()\b/;
    const htmlTags = /<\/?(html|head|body|div|span|h1|h2|p|script|style)>/i;

    if (lang === 'js') {
        if (pythonWords.test(code)) warning = "⚠️ تنبيه: يبدو أنك تكتب كود بايثون داخل كونسول جافا سكريبت!";
        else if (htmlTags.test(code)) warning = "⚠️ تنبيه: يبدو أنك تكتب وسوم HTML داخل كونسول جافا سكريبت!";
    } else if (lang === 'python') {
        if (jsWords.test(code)) warning = "⚠️ تنبيه: يبدو أنك تكتب كود جافا سكريبت داخل محرك بايثون!";
        else if (htmlTags.test(code)) warning = "⚠️ تنبيه: يبدو أنك تكتب وسوم HTML داخل محرك بايثون!";
    } else if (lang === 'web') {
        if (pythonWords.test(code)) warning = "⚠️ تنبيه: يبدو أنك تكتب كود بايثون داخل تصميم الويب!";
    }

    if (warning !== "") {
        warningMessage.textContent = warning;
        warningMessage.style.display = 'block';
    } else {
        warningMessage.style.display = 'none';
    }
}

// 1. إدارة اللغات واسترجاع الكود المحفوظ
function loadSavedCode() {
    if (languageSelect.value === 'python') {
        codeEditor.setOption("mode", "python");
        codeEditor.setValue(localStorage.getItem('savedPythonCode') || '');
    } else if (languageSelect.value === 'web') {
        codeEditor.setOption("mode", "htmlmixed");
        codeEditor.setValue(localStorage.getItem('savedWebCode') || '');
    } else if (languageSelect.value === 'js') {
        codeEditor.setOption("mode", "javascript");
        codeEditor.setValue(localStorage.getItem('savedJSCode') || '');
    }
    checkLanguage();
}

languageSelect.addEventListener('change', loadSavedCode);
window.addEventListener('DOMContentLoaded', loadSavedCode);

// الحفظ التلقائي والاقتراحات الذكية أثناء الكتابة
codeEditor.on('change', (instance, changeObj) => {
    const code = codeEditor.getValue();
    if (languageSelect.value === 'python') {
        localStorage.setItem('savedPythonCode', code);
    } else if (languageSelect.value === 'web') {
        localStorage.setItem('savedWebCode', code);
    } else if (languageSelect.value === 'js') {
        localStorage.setItem('savedJSCode', code);
    }
    checkLanguage();
    
    // إظهار الاقتراحات عند كتابة حروف حقيقية فقط
    const cursor = codeEditor.getCursor();
    const currentLine = codeEditor.getLine(cursor.line);
    const typedWord = currentLine.slice(0, cursor.ch).trim();
    const isAlphabet = /^[a-zA-Z]{2,}$/.test(typedWord);
    
    if (isAlphabet && changeObj.origin !== '+delete') {
        codeEditor.showHint({ completeSingle: false });
    }
});

// 2. تحميل الكود كملف
downloadBtn.addEventListener('click', () => {
    const code = codeEditor.getValue();
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    if (languageSelect.value === 'python') a.download = 'main.py';
    else if (languageSelect.value === 'web') a.download = 'index.html';
    else if (languageSelect.value === 'js') a.download = 'script.js';
    
    a.click();
    URL.revokeObjectURL(url);
});

// 3. مسح الكود
clearBtn.addEventListener('click', () => {
    codeEditor.setValue('');
    outputArea.textContent = '';
    webOutput.srcdoc = '';
    
    if (languageSelect.value === 'python') localStorage.setItem('savedPythonCode', '');
    else if (languageSelect.value === 'web') localStorage.setItem('savedWebCode', '');
    else if (languageSelect.value === 'js') localStorage.setItem('savedJSCode', '');
    
    checkLanguage();
});

// 4. بيئة بايثون (Pyodide)
let pyodideReadyPromise = main();

async function main() {
    outputArea.textContent = "جاري تحميل بيئة بايثون... يرجى الانتظار.";
    let pyodide = await loadPyodide();
    
    pyodide.setStdout({ batched: (msg) => { 
        outputArea.textContent += msg + "\n"; 
    }});
    
    await pyodide.runPythonAsync(`
import builtins
import js
def custom_input(prompt_text=""):
    return js.prompt(prompt_text)
builtins.input = custom_input
    `);
    
    outputArea.textContent = "المنصة جاهزة الآن!\n";
    return pyodide;
}

// 5. التشغيل (Run)
runBtn.addEventListener('click', async () => {
    const code = codeEditor.getValue();
    
    if (languageSelect.value === 'python') {
        outputArea.style.display = 'block';
        webOutput.style.display = 'none';
        outputArea.textContent = ""; 
        try {
            let pyodide = await pyodideReadyPromise;
            let result = await pyodide.runPythonAsync(code);
            if (result !== undefined) {
                outputArea.textContent += result + "\n";
            }
        } catch (err) {
            outputArea.textContent += "\nيوجد خطأ في الكود:\n" + err;
        }
    } 
    else if (languageSelect.value === 'web') {
        outputArea.style.display = 'none';
        webOutput.style.display = 'block';
        webOutput.srcdoc = code; 
    } 
    else if (languageSelect.value === 'js') {
        outputArea.style.display = 'block';
        webOutput.style.display = 'none';
        outputArea.textContent = "";
        
        const originalLog = console.log;
        console.log = function(...args) {
            outputArea.textContent += args.join(' ') + '\n';
            originalLog.apply(console, args);
        };
        
        try {
            let result = eval(code);
            if (result !== undefined && typeof result !== 'function') {
                outputArea.textContent += '< ' + result + '\n';
            }
        } catch (err) {
            outputArea.textContent += "يوجد خطأ في الكود:\n" + err.message + "\n";
        }
        console.log = originalLog;
    }
});