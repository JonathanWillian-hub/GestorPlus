import React from 'react';

export default function Privacidade() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 text-on-surface">
      <h1 className="text-3xl font-bold mb-6 text-primary">Política de Privacidade</h1>
      
      <div className="prose prose-invert max-w-none text-on-surface-variant space-y-4">
        <p><strong>Última atualização: {new Date().toLocaleDateString('pt-BR')}</strong></p>
        
        <h2>1. Introdução</h2>
        <p>
          Esta Política de Privacidade descreve como o GestorPlus coleta, usa e protege suas informações pessoais, em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018).
        </p>

        <h2>2. Dados Coletados</h2>
        <p>
          Coletamos as seguintes informações:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Dados de Identificação:</strong> Nome, endereço de e-mail e foto de perfil (quando fornecida).</li>
          <li><strong>Dados Financeiros:</strong> Transações, contas a pagar, faturas de cartão de crédito e metas, inseridos voluntariamente por você na plataforma.</li>
        </ul>

        <h2>3. Finalidade do Tratamento</h2>
        <p>
          Seus dados são utilizados exclusivamente para fornecer as funcionalidades da plataforma GestorPlus, ou seja, para permitir o controle e a gestão de suas finanças. Não vendemos, alugamos ou compartilhamos seus dados financeiros com terceiros sob nenhuma circunstância.
        </p>

        <h2>4. Armazenamento e Segurança</h2>
        <p>
          Utilizamos a infraestrutura de nuvem do Google (Firebase) para armazenar seus dados. Todos os dados trafegam criptografados. Implementamos regras de segurança rígidas (Firestore Rules) que garantem que apenas você tenha acesso aos seus registros financeiros.
        </p>

        <h2>5. Seus Direitos (Direito ao Esquecimento)</h2>
        <p>
          Conforme garantido pela LGPD, você tem o direito de:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Acessar seus dados a qualquer momento pelo painel do sistema.</li>
          <li>Corrigir dados incompletos, inexatos ou desatualizados.</li>
          <li><strong>Excluir completamente sua conta e seus dados:</strong> Disponibilizamos no menu de perfil um botão "Apagar conta". Ao confirmar, suas informações de login e todos os seus registros financeiros serão deletados de nossos servidores permanentemente.</li>
        </ul>

        <h2>6. Contato</h2>
        <p>
          Se você tiver dúvidas sobre esta política, sinta-se à vontade para entrar em contato com o administrador do sistema.
        </p>
      </div>
    </div>
  );
}
