const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando cadastro de respostas', () => {
  // cadastra uma pergunta para ser respondida
  modelo.cadastrar_pergunta('x + 3 = 5, x = ?');

  // pega o id da pergunta cadastrada
  const id_pergunta = modelo.listar_perguntas()[0].id_pergunta;

  // cadastra a resposta para a pergunta
  modelo.cadastrar_resposta(id_pergunta, 'x = 2');

  // confere se o número de respostas da pergunta foi atualizado
  const perguntas = modelo.listar_perguntas();
  expect(perguntas[0].num_respostas).toBe(1);
  
  // confere se os texto da pergunta e da resposta estão corretos
  expect(modelo.get_pergunta(id_pergunta).texto).toBe('x + 3 = 5, x = ?');
  expect(modelo.get_respostas(id_pergunta)[0].texto).toBe('x = 2');
});