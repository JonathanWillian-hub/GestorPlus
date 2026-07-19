import React from 'react';

export default function Termos() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 text-on-surface">
      <h1 className="text-3xl font-bold mb-6 text-primary">Termos de Serviço</h1>
      
      <div className="prose prose-invert max-w-none text-on-surface-variant space-y-4">
        <p><strong>Última atualização: {new Date().toLocaleDateString('pt-BR')}</strong></p>
        
        <h2>1. Aceitação dos Termos</h2>
        <p>
          Ao acessar e utilizar a plataforma GestorPlus, você concorda em cumprir e ser regido por estes Termos de Serviço. Se você não concordar com qualquer parte destes termos, não deverá utilizar nosso sistema.
        </p>

        <h2>2. Descrição do Serviço</h2>
        <p>
          O GestorPlus é um software de gestão financeira pessoal e empresarial que permite aos usuários registrar receitas, despesas, metas, contas e faturas de cartão de crédito.
        </p>

        <h2>3. Cadastro e Segurança</h2>
        <p>
          Para utilizar nossos serviços, você deve se cadastrar fornecendo um e-mail válido. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrem sob sua conta. Em caso de uso não autorizado, notifique-nos imediatamente.
        </p>

        <h2>4. Privacidade e Proteção de Dados (LGPD)</h2>
        <p>
          Respeitamos sua privacidade e protegemos seus dados pessoais de acordo com a Lei Geral de Proteção de Dados Pessoais (LGPD). Seus dados financeiros e de perfil não são compartilhados com terceiros e pertencem exclusivamente a você. Para mais detalhes, consulte nossa Política de Privacidade.
        </p>

        <h2>5. Cancelamento e Direito ao Esquecimento</h2>
        <p>
          Você pode cancelar sua conta a qualquer momento. Ao utilizar a opção "Apagar Conta" no seu perfil, todas as suas informações pessoais e registros financeiros serão permanentemente excluídos do nosso banco de dados, em total conformidade com a LGPD.
        </p>
      </div>
    </div>
  );
}
