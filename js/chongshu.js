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

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    // 侧边栏切换
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        if (sidebar.classList.contains('collapsed')) {
            mainContent.style.marginLeft = '60px';
        } else {
            mainContent.style.marginLeft = '250px';
        }
    });
    
    // 下拉菜单
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const parent = this.parentElement;
            parent.classList.toggle('open');
            
            // 关闭其他打开的下拉菜单
            dropdownToggles.forEach(otherToggle => {
                if (otherToggle !== toggle) {
                    otherToggle.parentElement.classList.remove('open');
                }
            });
        });
    });
    
    // 创建初始表格行并计算
    createTableRow(initialData);
    calculate();
    
    // 添加断面按钮
    document.getElementById('addRowBtn').addEventListener('click', function() {
        // 复制最后一行的数据作为新行的初始值
        const tableBody = document.querySelector('#dataTable tbody');
        const lastRow = tableBody.lastElementChild;
        
        if (lastRow) {
            const newData = {
                duanmian: getNextDuanmian(document.querySelector('#duanmian').value),
                hongshui: parseFloat(document.querySelector('#hongshui').value),
                shenhong: parseFloat(document.querySelector('#shenhong').value),
                liusu: parseFloat(document.querySelector('#liusu').value),
                jiaodu: parseFloat(document.querySelector('#jiaodu').value),
                bujunxishu: parseFloat(document.querySelector('#bujunxishu').value),
                n_value: parseFloat(document.querySelector('#n_value').value)
            };
            
            createTableRow(newData);
            calculate();
        } else {
            createTableRow(initialData);
            calculate();
        }
    });
    
    // 删除断面按钮
    document.getElementById('removeRowBtn').addEventListener('click', function() {
        const tableBody = document.querySelector('#dataTable tbody');
        if (tableBody.children.length > 1) {
            tableBody.removeChild(tableBody.lastElementChild);
        } else {
            alert('至少保留一个断面');
        }
    });
    
    // 计算按钮
    document.getElementById('calculateBtn').addEventListener('click', calculate);
    
    // 打印按钮
    document.getElementById('printBtn').addEventListener('click', function() {
        preparePrintTable();
        window.print();
    });
});

// 创建表格行
function createTableRow(data) {
    const tableBody = document.querySelector('#dataTable tbody');
    const row = document.createElement('tr');
    
    // 创建单元格和输入框
    const cells = [
        { id: 'duanmian', className: 'black-input', value: data.duanmian, disabled: false },
        { id: 'qidongliusu', className: '', value: '', disabled: true },
        { id: 'hongshui', className: 'black-input', value: data.hongshui, disabled: false, step: 0.01 },
        { id: 'shenhong', className: 'black-input', value: data.shenhong, disabled: false, step: 0.01 },
        { id: 'shuishen', className: '', value: '', disabled: true },
        { id: 'liusu', className: 'red-input', value: data.liusu, disabled: false, step: 0.01 },
        { id: 'jiaodu', className: 'red-input', value: data.jiaodu, disabled: false, step: 1 },
        { id: 'bujunxishu', className: 'red-input', value: data.bujunxishu, disabled: false, step: 0.1 },
        { id: 'pingjunliusu', className: '', value: '', disabled: true },
        { id: 'n_value', className: 'red-input', value: data.n_value, disabled: false, step: 0.01 },
        { id: 'chongshushendu', className: '', value: '', disabled: true }
    ];
    
    cells.forEach((cell, index) => {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = cell.id === 'duanmian' ? 'text' : 'number';
        
        // 为每个输入框生成唯一ID
        const rowIndex = tableBody.children.length;
        input.id = `${cell.id}_${rowIndex}`;
        input.dataset.baseId = cell.id; // 存储基本ID用于计算
        
        input.className = cell.className;
        input.value = cell.value;
        input.disabled = cell.disabled;
        if (cell.step) input.step = cell.step;
        
        // 添加输入事件监听器，实时计算
        if (!cell.disabled) {
            input.addEventListener('input', calculate);
        }
        
        td.appendChild(input);
        row.appendChild(td);
    });
    
    tableBody.appendChild(row);
}

// 计算函数
function calculate() {
    // 获取全局参数
    const zhongzhiliJing = parseFloat(document.getElementById('zhongzhiliJing').value); // 中值粒径d50
    const nishazongzhong = parseFloat(document.getElementById('nishazongzhong').value); // 泥沙容重γs
    
    // 获取所有行
    const rows = document.querySelectorAll('#dataTable tbody tr');
    
    // 对每一行进行计算
    rows.forEach((row, rowIndex) => {
        // 获取当前行的输入值
        const hongshui = parseFloat(row.querySelector(`[data-base-id="hongshui"]`).value);
        const shenhong = parseFloat(row.querySelector(`[data-base-id="shenhong"]`).value);
        const liusu = parseFloat(row.querySelector(`[data-base-id="liusu"]`).value);
        const jiaodu = parseFloat(row.querySelector(`[data-base-id="jiaodu"]`).value);
        const bujunxishu = parseFloat(row.querySelector(`[data-base-id="bujunxishu"]`).value);
        const n_value = parseFloat(row.querySelector(`[data-base-id="n_value"]`).value);
        
        // 计算水深 H0 = 设计洪水位 - 深泓点高程
        const shuishen = hongshui - shenhong;
        row.querySelector(`[data-base-id="shuishen"]`).value = shuishen.toFixed(2);
        
        // 计算泥沙启动流速 Uc
        const qidongliusu = Math.pow(shuishen / zhongzhiliJing, 0.14) * 
                            Math