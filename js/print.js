// 打印结果
function printResults() {
    // 清空打印表格
    const printTableBody = document.getElementById('printTableBody');
    printTableBody.innerHTML = '';
    
    // 获取所有数据行
    const rows = document.querySelectorAll('#dataTable tr:not(.header-row):not(.subheader-row)');
    
    // 获取中值粒径d50
    const zhongzhiliJing = parseFloat(document.getElementById('nishazongzhong').value);
    
    // 遍历每一行，提取数据并添加到打印表格
    rows.forEach((row, index) => {
        const rowNum = index + 1;
        
        // 检查行是否存在
        if (!document.getElementById(`duanmian_${rowNum}`)) {
            return; // 跳过不存在的行
        }
        
        // 获取数据
        const duanmian = document.getElementById(`duanmian_${rowNum}`).value;
        const chongshushendu = document.getElementById(`chongshushendu_${rowNum}`).value;
        const liusu = document.getElementById(`liusu_${rowNum}`).value;
        const pingjunliusu = document.getElementById(`pingjunliusu_${rowNum}`).value;
        const n_value = document.getElementById(`n_value_${rowNum}`).value;
        const jiaodu = document.getElementById(`jiaodu_${rowNum}`).value;
        
        // 创建新行
        const printRow = document.createElement('tr');
        
        // 添加单元格
        const cells = [
            duanmian, // 断面位置
            chongshushendu, // 冲刷深度Hp
            liusu, // 平均流速U
            zhongzhiliJing.toFixed(4), // d50
            pingjunliusu, // 近岸垂线平均流速Ucp
            n_value, // 水流流速不均匀系数
            jiaodu, // 向与岸坡夹角α
            '' // 局部冲刷深度hs(m) - 留空
        ];
        
        cells.forEach(cellValue => {
            const td = document.createElement('td');
            td.textContent = cellValue;
            printRow.appendChild(td);
        });
        
        printTableBody.appendChild(printRow);
    });
    
    // 打印
    window.print();
}