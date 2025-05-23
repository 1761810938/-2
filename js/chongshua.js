// 行计数器
let rowCounter = 0;

// 初始数据
const initialData = {
    duanmian: "K0+379.0",
    hongshui: 2240.84,
    shenhong: 2239.24,
    liusu: 3.21,
    jiaodu: 15,
    bujunxishu: 1.5,
    n_value: 0.23
};

// 页面加载时创建表格行并自动计算一次
window.onload = function() {
    addRow(initialData);
};

// 添加新行
function addRow(data = null) {
    rowCounter++;
    const rowId = `row_${rowCounter}`;
    
    // 如果没有提供数据，使用默认值
    if (!data) {
        data = {
            duanmian: "",
            hongshui: 0,
            shenhong: 0,
            liusu: 0,
            jiaodu: 15,
            bujunxishu: 1.5,
            n_value: 0.23
        };
    }
    
    const table = document.getElementById('dataTable');
    const row = document.createElement('tr');
    row.id = rowId;
    
    // 创建单元格和输入框
    const cells = [
        { id: `duanmian_${rowCounter}`, className: 'black-input', value: data.duanmian, disabled: false },
        { id: `qidongliusu_${rowCounter}`, className: '', value: '', disabled: true },
        { id: `hongshui_${rowCounter}`, className: 'black-input', value: data.hongshui, disabled: false, step: 0.01 },
        { id: `shenhong_${rowCounter}`, className: 'black-input', value: data.shenhong, disabled: false, step: 0.01 },
        { id: `shuishen_${rowCounter}`, className: '', value: '', disabled: true },
        { id: `liusu_${rowCounter}`, className: 'red-input', value: data.liusu, disabled: false, step: 0.01 },
        { id: `jiaodu_${rowCounter}`, className: 'red-input', value: data.jiaodu, disabled: false, step: 1 },
        { id: `bujunxishu_${rowCounter}`, className: 'red-input', value: data.bujunxishu, disabled: false, step: 0.1 },
        { id: `pingjunliusu_${rowCounter}`, className: '', value: '', disabled: true },
        { id: `n_value_${rowCounter}`, className: 'red-input', value: data.n_value, disabled: false, step: 0.01 },
        { id: `chongshushendu_${rowCounter}`, className: '', value: '', disabled: true }
    ];
    
    cells.forEach(cell => {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = cell.id.startsWith('duanmian') ? 'text' : 'number';
        input.id = cell.id;
        input.className = cell.className;
        input.value = cell.value;
        input.disabled = cell.disabled;
        if (cell.step) input.step = cell.step;
        
        // 添加输入事件监听器，实时计算
        if (!cell.disabled) {
            input.addEventListener('input', function() {
                calculateRow(rowCounter);
            });
        }
        
        td.appendChild(input);
        row.appendChild(td);
    });
    
    // 添加删除按钮
    const deleteCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn delete-btn';
    deleteButton.textContent = '删除';
    deleteButton.onclick = function() {
        deleteRow(rowId);
    };
    deleteCell.appendChild(deleteButton);
    row.appendChild(deleteCell);
    
    table.appendChild(row);
    
    // 计算新行
    calculateRow(rowCounter);
}

// 删除行
function deleteRow(rowId) {
    const row = document.getElementById(rowId);
    if (row && document.querySelectorAll('#dataTable tr').length > 3) { // 保留至少一行数据
        row.remove();
    } else {
        alert('至少保留一行数据！');
    }
}

// 计算单行数据
function calculateRow(rowNum) {
    // 获取输入值
    const zhongzhiliJing = parseFloat(document.getElementById('nishazongzhong').value); // 中值粒径d50
    const nishazongzhong = parseFloat(document.getElementById('tianchongneironggongshi').value); // 泥沙容重γs
    
    const hongshui = parseFloat(document.getElementById(`hongshui_${rowNum}`).value);
    const shenhong = parseFloat(document.getElementById(`shenhong_${rowNum}`).value);
    const liusu = parseFloat(document.getElementById(`liusu_${rowNum}`).value);
    const jiaodu = parseFloat(document.getElementById(`jiaodu_${rowNum}`).value);
    const bujunxishu = parseFloat(document.getElementById(`bujunxishu_${rowNum}`).value);
    const n_value = parseFloat(document.getElementById(`n_value_${rowNum}`).value);

    // 计算水深 H0 = 设计洪水位 - 深泓点高程
    const shuishen = hongshui - shenhong;
    document.getElementById(`shuishen_${rowNum}`).value = shuishen.toFixed(2);

    // 计算泥沙启动流速 Uc
    const qidongliusu = Math.pow(shuishen / zhongzhiliJing, 0.14) * 
                        Math.sqrt(17.6 * zhongzhiliJing * (nishazongzhong - 9.81) / 9.81 + 
                        (0.000000605 * (10 + shuishen)) / Math.pow(zhongzhiliJing, 0.72));
    document.getElementById(`qidongliusu_${rowNum}`).value = qidongliusu.toFixed(3);

    // 计算近岸垂线平均流速 Ucp = F4*2*H4/(1+H4)
    const pingjunliusu = liusu * 2 * bujunxishu / (1 + bujunxishu);
    document.getElementById(`pingjunliusu_${rowNum}`).value = pingjunliusu.toFixed(3);

    // 计算冲刷深度 hs = E4*((I4/B4)^J4-1)
    const chongshushendu = shuishen * (Math.pow(pingjunliusu / qidongliusu, n_value) - 1);
    document.getElementById(`chongshushendu_${rowNum}`).value = chongshushendu.toFixed(3);
}

// 计算所有行
function calculateAll() {
    for (let i = 1; i <= rowCounter; i++) {
        if (document.getElementById(`duanmian_${i}`)) {
            calculateRow(i);
        }
    }
}