const ExcelJS = require('exceljs');
const { Gestante, Crianca } = require('../../lib/models');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const { tipo } = req.query;
    const workbook = new ExcelJS.Workbook();
    
    if (tipo === 'gestantes' || !tipo) {
      const gestantes = await Gestante.findAll();
      const worksheet = workbook.addWorksheet('Gestantes');
      
      worksheet.columns = [
        { header: 'Nome', key: 'nome', width: 30 },
        { header: 'CNS', key: 'cns', width: 20 },
        { header: 'Idade', key: 'idade', width: 10 },
        { header: 'UBS', key: 'ubs', width: 25 },
        { header: 'Classificação', key: 'classificacao', width: 20 },
        { header: 'Data Consulta', key: 'data_consulta', width: 15 }
      ];
      
      gestantes.forEach(g => worksheet.addRow(g.toJSON()));
    }
    
    if (tipo === 'criancas') {
      const criancas = await Crianca.findAll();
      const worksheet = workbook.addWorksheet('Crianças');
      
      worksheet.columns = [
        { header: 'Criança', key: 'nome', width: 25 },
        { header: 'Mãe', key: 'nome_mae', width: 25 },
        { header: 'Telefone', key: 'telefone', width: 15 },
        { header: 'UBS', key: 'ubs', width: 25 },
        { header: 'Risco', key: 'risco', width: 15 },
        { header: 'Retorno', key: 'data_retorno', width: 15 }
      ];
      
      criancas.forEach(c => worksheet.addRow(c.toJSON()));
    }
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=relatorio_${tipo || 'geral'}.xlsx`);
    
    await workbook.xlsx.write(res);
    res.end();
    
  } catch (error) {
    console.error('Erro exportação:', error);
    res.status(500).json({ error: 'Erro ao gerar relatório' });
  }
};