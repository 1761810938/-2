// Word导出功能
function exportToWord() {
    // 创建一个新的Word文档内容
    let tableContent = '<table border="1" cellspacing="0" cellpadding="5" style="border-collapse: collapse; width: 100%;">';
    
    // 添加表头 - 移除了背景填充色
    tableContent += '<tr style="font-weight: bold; text-align: center;">';
    tableContent += '<th>断面位置(m)</th>';
    tableContent += '<th>冲刷深度Hp(m)</th>';
    tableContent += '<th>平均流速U(m/s)</th>';
    tableContent += '<th>d50(m)</th>';
    tableContent += '<th>近岸垂线平均流速Ucp(m/s)</th>';
    tableContent += '<th>水流流速不均匀系数η</th>';
    tableContent += '<th>向与岸坡夹角α</th>';
    tableContent += '<th>局部冲刷深度hs(m)</th>';
    tableContent += '</tr>';
    
    // 获取中值粒径d50
    const zhongzhiliJing = parseFloat(document.getElementById('nishazongzhong').value);
    
    // 获取所有数据行
    let minChongShu = Infinity;
    let maxChongShu = -Infinity;
    
    // 遍历每一行，提取数据
    for (let i = 1; i <= rowCounter; i++) {
        if (!document.getElementById(`duanmian_${i}`)) {
            continue; // 跳过不存在的行
        }
        
        // 获取数据
        const duanmian = document.getElementById(`duanmian_${i}`).value;
        const chongshushendu = parseFloat(document.getElementById(`chongshushendu_${i}`).value);
        const liusu = document.getElementById(`liusu_${i}`).value;
        const pingjunliusu = document.getElementById(`pingjunliusu_${i}`).value;
        const n_value = document.getElementById(`n_value_${i}`).value;
        const jiaodu = document.getElementById(`jiaodu_${i}`).value;
        
        // 更新最小和最大冲刷深度
        if (chongshushendu < minChongShu) minChongShu = chongshushendu;
        if (chongshushendu > maxChongShu) maxChongShu = chongshushendu;
        
        // 添加行数据
        tableContent += '<tr style="text-align: center;">';
        tableContent += `<td>${duanmian}</td>`;
        tableContent += `<td>${chongshushendu}</td>`;
        tableContent += `<td>${liusu}</td>`;
        tableContent += `<td>${zhongzhiliJing.toFixed(4)}</td>`;
        tableContent += `<td>${pingjunliusu}</td>`;
        tableContent += `<td>${n_value}</td>`;
        tableContent += `<td>${jiaodu}</td>`;
        tableContent += `<td></td>`; // 局部冲刷深度留空
        tableContent += '</tr>';
    }
    
    tableContent += '</table>';
    
    // 创建一个Blob对象，设置A4纸张大小和纵向布局，添加页面视图设置
    const blob = new Blob([
        '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">' +
        '<head>' +
        '<meta charset="utf-8">' +
        '<title>冲刷计算结果</title>' +
        '<style>' +
        '@page { size: A4 portrait; margin: 2cm; }' +
        'body { width: 21cm; height: 29.7cm; margin: 0 auto; }' +
        'table { width: 100%; border-collapse: collapse; }' +
        'th, td { border: 1px solid #000; padding: 5px; text-align: center; }' +
        '</style>' +
        '<!-- 设置Word默认打开为页面视图 -->' +
        '<xml>' +
        '<w:WordDocument>' +
        '<w:View>Print</w:View>' +
        '<w:Zoom>100</w:Zoom>' +
        '</w:WordDocument>' +
        '</xml>' +
        '</head><body>' +
        tableContent +
        '</body></html>'
    ], { type: 'application/msword' });
    
    // 创建下载链接
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = '冲刷计算结果.doc';
    
    // 触发下载
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 生成设计报告
function generateReport() {
    // 获取中值粒径d50
    const zhongzhiliJing = parseFloat(document.getElementById('nishazongzhong').value);
    
    // 获取所有数据行
    let minChongShu = Infinity;
    let maxChongShu = -Infinity;
    
    // 遍历每一行，提取数据
    for (let i = 1; i <= rowCounter; i++) {
        if (!document.getElementById(`duanmian_${i}`)) {
            continue; // 跳过不存在的行
        }
        
        // 获取冲刷深度并更新最小和最大值
        const chongshushendu = parseFloat(document.getElementById(`chongshushendu_${i}`).value);
        if (chongshushendu < minChongShu) minChongShu = chongshushendu;
        if (chongshushendu > maxChongShu) maxChongShu = chongshushendu;
    }
    
    // 格式化最小和最大冲刷深度
    minChongShu = minChongShu.toFixed(2);
    maxChongShu = maxChongShu.toFixed(2);
    
    // 创建表格内容
    let tableContent = '<table border="1" cellspacing="0" cellpadding="5" style="border-collapse: collapse; width: 100%;">';
    
    // 添加表头 - 移除了背景填充色
    tableContent += '<tr style="font-weight: bold; text-align: center;">';
    tableContent += '<th>断面位置(m)</th>';
    tableContent += '<th>冲刷深度Hp(m)</th>';
    tableContent += '<th>平均流速U(m/s)</th>';
    tableContent += '<th>d50(m)</th>';
    tableContent += '<th>近岸垂线平均流速Ucp(m/s)</th>';
    tableContent += '<th>水流流速不均匀系数η</th>';
    tableContent += '<th>向与岸坡夹角α</th>';
    tableContent += '<th>局部冲刷深度hs(m)</th>';
    tableContent += '</tr>';
    
    // 遍历每一行，提取数据
    for (let i = 1; i <= rowCounter; i++) {
        if (!document.getElementById(`duanmian_${i}`)) {
            continue; // 跳过不存在的行
        }
        
        // 获取数据
        const duanmian = document.getElementById(`duanmian_${i}`).value;
        const chongshushendu = document.getElementById(`chongshushendu_${i}`).value;
        const liusu = document.getElementById(`liusu_${i}`).value;
        const pingjunliusu = document.getElementById(`pingjunliusu_${i}`).value;
        const n_value = document.getElementById(`n_value_${i}`).value;
        const jiaodu = document.getElementById(`jiaodu_${i}`).value;
        
        // 添加行数据
        tableContent += '<tr style="text-align: center;">';
        tableContent += `<td>${duanmian}</td>`;
        tableContent += `<td>${chongshushendu}</td>`;
        tableContent += `<td>${liusu}</td>`;
        tableContent += `<td>${zhongzhiliJing.toFixed(4)}</td>`;
        tableContent += `<td>${pingjunliusu}</td>`;
        tableContent += `<td>${n_value}</td>`;
        tableContent += `<td>${jiaodu}</td>`;
        tableContent += `<td></td>`; // 局部冲刷深度留空
        tableContent += '</tr>';
    }
    
    tableContent += '</table>';
    
    // 创建报告内容，使用文本描述替代公式图片
    const reportContent = `
    <h2>5.4.2 冲刷计算及基础埋置深度</h2>
    <h3>5.4.2.1 冲刷计算</h3>
    <p style="text-indent: 2em;">根据《堤防工程设计规范》(GB50286-2013)7.8.5 条规定，防洪墙基础埋置深度应满足抗冲刷和冻结深度的要求。水流平行岸坡的冲刷一般发生在两个弯道之间的过渡段或半径很大的微弯河段，水流斜冲岸坡的冲刷一般发生在弯道的凹岸的水流顶冲段。本次计算采用《堤防工程设计规范》(GB50286-2013)附录 D.2 局部冲刷公式进行河道冲刷深度计算，根据计算值并结合现场调查，确定冲刷深度。</p>
    <p style="text-indent: 2em;">根据《堤防工程设计规范》(GB50286-2013)D.2.2 条规定，水流对岸坡的冲刷与近岸流速、水深、水流方向与岸坡的夹角、河床组成因素有关，其冲刷深度可按下式进行计算：</p>
    <p style="text-align: center; font-weight: bold;">hs = H0 × (Ucp/Uc)^n - 1)</p>
    <p style="text-align: center; font-weight: bold;">hs = 建议自行使用公式编辑器编辑属下规范</p>
    <p>式中：hs—局部冲刷深度（m）；</p>
    <p>H0—冲刷处的水深（m）；</p>
    <p>Ucp—近岸垂线平均流速（m/s）；</p>
    <p>Uc—泥沙的起动流速（m/s）；</p>
    <p>n—与防护岸坡在平面上的形状有关，取 1/4；</p>
    <p>Uc按下式计算：</p>
    <p style="text-align: center; font-weight: bold;">Uc = (H0/d50)^0.14 × [17.6 × ((γs-γ)/γ) × d50 ＋ 0.000000605 × (10+H0)/(d50^0.72)]^0.5</p>
    <p style="text-align: center; font-weight: bold;">Uc = 建议自行使用公式编辑器编辑属下规范</p>
    <p>式中：Uc—泥沙的起动流速（m/s）；</p>
    <p>d50—床砂的中值粒径；根据河床质颗分曲线，泥沙中值粒径取 ${zhongzhiliJing.toFixed(4)}m。</p>
    <p>γs、γ—泥沙与水的容重（KN/m³）；</p>
    <p>H0—行进水流水深（m）；</p>
    <p>g—重力加速度（m/s）；</p>
    <p>Ucp按下式计算：</p>
    <p style="text-align: center; font-weight: bold;">Ucp = U × [(2η)/(1+η)]</p>
    <p style="text-align: center; font-weight: bold;">Ucp = 建议自行使用公式编辑器编辑属下规范</p>
    <p>式中：U—行近流速（m/s）；</p>
    <p>Η—水流流速分配不均匀系数，根据水流流向与岸坡交角α角查表采用。</p>
    <h3 style="text-align: center;">表5.4.3 冲刷深度计算表</h3>
    ${tableContent}
    <p>根据上述公式，结合工程布置，冲刷深度结果为${minChongShu}~${maxChongShu}m。</p>
    `;
    
    // 创建一个Blob对象，设置A4纸张大小和纵向布局
    const blob = new Blob([
        '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">' +
        '<head>' +
        '<meta charset="utf-8">' +
        '<title>冲刷计算设计报告</title>' +
        '<style>' +
        '@page { size: A4 portrait; margin: 2cm; }' +
        'body { width: 21cm; height: 29.7cm; margin: 0 auto; font-family: SimSun, serif; }' +
        'h2, h3 { font-weight: bold; }' +
        'h2 { font-size: 16pt; }' +
        'h3 { font-size: 14pt; }' +
        'p { font-size: 12pt; line-height: 1.5; }' +
        'table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
        'th, td { border: 1px solid #000; padding: 5px; text-align: center; font-size: 10pt; }' +
        '</style>' +
        '<!-- 设置Word默认打开为页面视图 -->' +
        '<xml>' +
        '<w:WordDocument>' +
        '<w:View>Print</w:View>' +
        '<w:Zoom>100</w:Zoom>' +
        '</w:WordDocument>' +
        '</xml>' +
        '</head><body>' +
        reportContent +
        '</body></html>'
    ], { type: 'application/msword' });
    
    // 创建下载链接
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = '冲刷计算设计报告.doc';
    
    // 触发下载
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 加载图片并转换为base64
function loadImagesAsBase64() {
    return new Promise((resolve, reject) => {
        const images = {
            formula1: '',
            formula2: '',
            formula3: ''
        };
        
        // 创建图片对象并加载
        const img1 = new Image();
        const img2 = new Image();
        const img3 = new Image();
        
        // 设置图片路径
        img1.src = 'images/formula1.png'; // 移除了../前缀
        img2.src = 'images/formula2.png'; // 移除了../前缀
        img3.src = 'images/formula3.png'; // 移除了../前缀
        
        // 计数器，用于跟踪已加载的图片数量
        let loadedCount = 0;
        
        // 图片加载成功处理函数
        const onLoad = (img, key) => {
            // 创建canvas将图片转为base64
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            // 将图片转换为base64格式
            images[key] = canvas.toDataURL('image/png');
            
            // 增加计数器
            loadedCount++;
            
            // 当所有图片都加载完成时，解析Promise
            if (loadedCount === 3) {
                resolve(images);
            }
        };
        
        // 图片加载失败处理函数
        const onError = (key) => {
            console.error(`加载图片 ${key} 失败`);
            reject(new Error(`加载图片 ${key} 失败`));
        };
        
        // 设置图片加载事件
        img1.onload = () => onLoad(img1, 'formula1');
        img2.onload = () => onLoad(img2, 'formula2');
        img3.onload = () => onLoad(img3, 'formula3');
        
        img1.onerror = () => onError('formula1');
        img2.onerror = () => onError('formula2');
        img3.onerror = () => onError('formula3');
    });
}