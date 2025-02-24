document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');
    const originalImage = document.getElementById('originalImage');
    const compressedImage = document.getElementById('compressedImage');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');

    // 处理拖放上传
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#0071e3';
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#c7c7c7';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#c7c7c7';
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    // 处理点击上传
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    // 处理图片文件
    function handleFile(file) {
        if (!file.type.match('image.*')) {
            alert('请上传图片文件！');
            return;
        }

        // 显示原始文件大小
        originalSize.textContent = formatFileSize(file.size);

        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage.src = e.target.result;
            compressImage(e.target.result);
            previewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    // 压缩图片
    function compressImage(src) {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // 保持原始尺寸
            canvas.width = img.width;
            canvas.height = img.height;

            // 绘制图片
            ctx.drawImage(img, 0, 0);

            // 获取压缩质量
            const quality = qualitySlider.value / 100;
            
            // 压缩图片
            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            compressedImage.src = compressedDataUrl;

            // 计算压缩后的大小
            const compressedBytes = Math.round(compressedDataUrl.length * 0.75);
            compressedSize.textContent = formatFileSize(compressedBytes);
        };
        img.src = src;
    }

    // 质量滑块变化时重新压缩
    qualitySlider.addEventListener('input', () => {
        qualityValue.textContent = qualitySlider.value + '%';
        if (originalImage.src) {
            compressImage(originalImage.src);
        }
    });

    // 下载压缩后的图片
    downloadBtn.addEventListener('click', () => {
        if (!compressedImage.src) return;
        
        const link = document.createElement('a');
        const timestamp = new Date().getTime();
        link.download = `compressed-image-${timestamp}.jpg`;
        link.href = compressedImage.src;
        link.click();
    });

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 