import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, History, HelpCircle, LogOut, UserCircle, Menu, Plus, Target, Calendar, CreditCard, TrendingUp, Mail, ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { cn } from '../lib/utils';

export default function Layout() {
  const { user, loading, logout, resendVerification, checkVerificationStatus, deleteAccount } = useFinance();
  const navigate = useNavigate();
  const location = useLocation();

  const [checking, setChecking] = React.useState(false);
  const [resending, setResending] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState<{ text: string, type: 'success' | 'error' | 'info' } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [deleteConfirmationName, setDeleteConfirmationName] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-primary">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-10 h-10 animate-spin" />
          <span className="text-sm font-semibold tracking-wide text-on-surface-variant">Carregando GestorPlus...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se o usuário logou por e-mail e senha e ainda não verificou o e-mail, barra o acesso
  if (user && user.emailVerified === false) {
    const handleCheckVerification = async () => {
      setChecking(true);
      setStatusMessage(null);
      try {
        const isVerified = await checkVerificationStatus();
        if (isVerified) {
          setStatusMessage({ text: 'E-mail verificado com sucesso! Redirecionando...', type: 'success' });
        } else {
          setStatusMessage({ text: 'O e-mail ainda não foi verificado. Por favor, acesse seu e-mail e clique no link de ativação enviado.', type: 'error' });
        }
      } catch (err) {
        setStatusMessage({ text: 'Erro ao verificar o e-mail. Tente novamente.', type: 'error' });
      } finally {
        setChecking(false);
      }
    };

    const handleResend = async () => {
      setResending(true);
      setStatusMessage(null);
      try {
        await resendVerification();
        setStatusMessage({ text: 'E-mail de verificação enviado com sucesso!', type: 'success' });
      } catch (err) {
        setStatusMessage({ text: 'Erro ao reenviar o e-mail. Tente novamente em alguns instantes.', type: 'error' });
      } finally {
        setResending(false);
      }
    };

    const handleLogout = async () => {
      await logout();
      navigate('/login');
    };

    return (
      <div className="bg-background min-h-screen flex items-center justify-center p-6 md:p-10 font-sans text-on-surface antialiased overflow-hidden relative">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-primary-container opacity-10 blur-[100px]" />
          <div className="absolute top-[60%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-error-container opacity-5 blur-[80px]" />
        </div>

        <main className="w-full max-w-[480px] relative z-10">
          <div className="glass-panel rounded-[24px] shadow-[0px_10px_30px_rgba(0,0,0,0.5)] p-6 md:p-10 w-full bg-surface-container/80 backdrop-blur-md border border-outline-variant/30 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center mb-6">
              <Mail className="w-8 h-8 text-primary animate-bounce" />
            </div>

            <h2 className="text-2xl font-bold text-on-surface mb-2">Verifique seu E-mail</h2>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
              Enviamos as instruções de confirmação para o endereço <strong className="text-primary">{user.email}</strong>.<br />
              Por favor, ative sua conta para liberar o acesso ao GestorPlus.
            </p>

            {/* Aviso de Caixa de Spam */}
            <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-left text-xs text-amber-300 leading-relaxed flex gap-2.5 items-start">
              <span className="text-base leading-none">⚠️</span>
              <div>
                <strong className="text-amber-400 block mb-0.5">Não encontrou o e-mail?</strong>
                Verifique sempre a sua <strong>pasta de Spam ou Lixo Eletrônico</strong>. Pode levar alguns minutos para o e-mail chegar.
              </div>
            </div>

            {statusMessage && (
              <div className={cn(
                "p-3 rounded-lg text-xs leading-relaxed mb-4 text-left border",
                statusMessage.type === 'success' && "bg-success-container/20 border-success/30 text-primary",
                statusMessage.type === 'error' && "bg-error-container/20 border-error/30 text-error",
                statusMessage.type === 'info' && "bg-secondary-container/20 border-secondary/30 text-secondary"
              )}>
                {statusMessage.text}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={handleCheckVerification}
                disabled={checking}
                className="w-full h-12 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-on-primary text-sm font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {checking ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Já Verifiquei / Atualizar
                  </>
                )}
              </button>

              <button
                onClick={handleResend}
                disabled={resending}
                className="w-full h-12 border border-outline-variant hover:bg-surface-container-high text-on-surface text-sm font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {resending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Reenviar E-mail de Verificação
                  </>
                )}
              </button>

              <button
                onClick={handleLogout}
                className="w-full h-12 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high text-sm font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sair / Entrar com outra conta
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Admin approval check
  if (user && user.status !== 'approved') {
    const handleLogout = async () => {
      await logout();
      navigate('/login');
    };

    return (
      <div className="bg-background min-h-screen flex items-center justify-center p-6 md:p-10 font-sans text-on-surface antialiased overflow-hidden relative">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-primary-container opacity-10 blur-[100px]" />
          <div className="absolute top-[60%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-error-container opacity-5 blur-[80px]" />
        </div>

        <main className="w-full max-w-[480px] relative z-10">
          <div className="glass-panel rounded-[24px] shadow-[0px_10px_30px_rgba(0,0,0,0.5)] p-6 md:p-10 w-full bg-surface-container/80 backdrop-blur-md border border-outline-variant/30 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center mb-6">
              {user.status === 'rejected' ? (
                <LogOut className="w-8 h-8 text-error animate-pulse" />
              ) : (
                <RefreshCw className="w-8 h-8 text-primary animate-spin-slow" />
              )}
            </div>

            <h2 className="text-2xl font-bold text-on-surface mb-2">
              {user.status === 'rejected' ? 'Acesso Bloqueado' : 'Aguardando Aprovação'}
            </h2>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
              {user.status === 'rejected' 
                ? 'Sua conta foi bloqueada ou não foi aprovada pelo administrador. Entre em contato para mais informações.'
                : 'Sua conta foi criada com sucesso, mas precisa ser aprovada pelo administrador antes de você poder acessar a plataforma.'}
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-on-primary text-sm font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Atualizar Status
              </button>

              <button
                onClick={handleLogout}
                className="w-full h-12 border border-outline-variant hover:bg-surface-container-high text-on-surface text-sm font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Visão Geral', path: '/', icon: LayoutDashboard },
    { name: 'Metas', path: '/metas', icon: Target },
    { name: 'Agenda de Contas', path: '/contas', icon: Calendar },
    { name: 'Cartões', path: '/cartoes', icon: CreditCard },
    { name: 'Evolução', path: '/evolucao', icon: TrendingUp },
    { name: 'Histórico', path: '/history', icon: History },
  ];

  if (user?.role === 'admin') {
    navItems.push({ name: 'Administração', path: '/admin/users', icon: UserCircle });
  }

  return (
    <div className="flex min-h-screen bg-background text-on-background font-sans selection:bg-primary-container selection:text-on-primary-container">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* SideNavBar */}
      <aside className={cn(
        "bg-surface-container-low flex flex-col h-[100dvh] w-64 py-6 px-2 border-r border-outline-variant/30 fixed left-0 top-0 z-50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] overflow-y-auto transition-transform duration-300 md:translate-x-0 md:flex",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="px-4 mb-8 relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 text-left w-full hover:bg-surface-container-high p-2 -ml-2 rounded-lg transition-colors"
          >
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-outline-variant/30" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
                <UserCircle className="text-primary w-6 h-6" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-base font-semibold text-primary truncate max-w-[120px]">GestorPlus</span>
              <span className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase">{user.plan}</span>
            </div>
          </button>
          
          {showProfileMenu && (
            <div className="absolute top-full left-4 right-4 mt-1 bg-surface-container-highest border border-outline-variant/30 rounded-lg shadow-lg overflow-hidden z-50">
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  setShowDeleteModal(true);
                }}
                className="w-full text-left px-4 py-3 text-sm text-error hover:bg-error/10 transition-colors flex items-center gap-2 font-medium"
              >
                Apagar conta
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="px-2 mb-6 flex flex-col gap-2">
          <button 
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/add-income');
            }}
            className="w-full bg-primary hover:bg-primary/90 text-on-primary font-semibold text-sm rounded-lg py-2.5 flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Adicionar Receita
          </button>
          <button 
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/add-expense');
            }}
            className="w-full bg-surface-container-highest hover:bg-surface-container-highest/80 text-on-surface border border-outline-variant/30 font-semibold text-sm rounded-lg py-2.5 flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5 text-error" />
            Nova Despesa
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 flex-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 group",
                  isActive 
                    ? "bg-primary-container/20 text-primary translate-x-1" 
                    : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-on-surface-variant group-hover:text-primary transition-colors")} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Links */}
        <div className="mt-auto px-2 border-t border-outline-variant/30 pt-4 flex flex-col gap-1">
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-all duration-200">
            <HelpCircle className="w-5 h-5" />
            Central de Ajuda
          </a>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 w-full text-left rounded-lg text-sm font-semibold text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-all duration-200">
            <LogOut className="w-5 h-5" />
            Sair
          </button>
          
          <div className="flex items-center justify-center gap-3 mt-4 mb-2 text-xs text-on-surface-variant/70">
            <NavLink to="/termos" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors">Termos</NavLink>
            <span>&bull;</span>
            <NavLink to="/privacidade" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors">LGPD</NavLink>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden fixed top-0 w-full h-16 bg-surface shadow-[0_4px_20px_rgba(0,0,0,0.2)] border-b border-outline-variant/30 flex items-center justify-between px-4 z-30">
        <div className="flex items-center gap-3">
          <button className="text-on-surface" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-primary">GestorPlus</h1>
        </div>
        {user.avatarUrl && (
          <img src={user.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-outline-variant/30" />
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 pb-20 md:pb-0 min-h-screen">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full h-16 bg-surface-container-low border-t border-outline-variant/30 shadow-[0_-4px_20px_rgba(0,0,0,0.2)] flex justify-around items-center px-4 z-30">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-16 h-full p-1 rounded-lg transition-colors duration-200",
                isActive ? "text-primary scale-95" : "text-on-surface-variant hover:bg-surface-container-high"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "drop-shadow-[0_0_8px_rgba(72,224,137,0.3)]")} />
              <span className="text-[10px] whitespace-nowrap font-semibold leading-none">{item.name.replace('Adicionar ', '')}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-surface-container w-full max-w-md rounded-2xl p-6 border border-error/30 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-error mb-2">Excluir Conta Permanentemente</h3>
            <p className="text-on-surface-variant text-sm mb-4">
              Esta ação é irreversível. Todos os seus dados financeiros serão apagados imediatamente. Para confirmar, digite <strong>{user.name}</strong> abaixo:
            </p>
            <input
              type="text"
              value={deleteConfirmationName}
              onChange={(e) => setDeleteConfirmationName(e.target.value)}
              placeholder={`Digite ${user.name}`}
              className="w-full bg-surface-container-highest border border-outline-variant rounded-lg p-3 text-on-surface focus:outline-none focus:border-error mb-6"
            />
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmationName('');
                }}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-surface-container-highest transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  if (deleteConfirmationName === user.name) {
                    setIsDeleting(true);
                    try {
                      await deleteAccount();
                      // Redirect occurs via FinanceContext automatically when user becomes null
                    } catch (err) {
                      alert("Erro ao excluir conta. Você precisa ter feito login recentemente para apagar a conta por segurança. Saia, entre novamente e tente outra vez.");
                      setIsDeleting(false);
                    }
                  }
                }}
                disabled={deleteConfirmationName !== user.name || isDeleting}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-error text-on-error hover:bg-error/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isDeleting ? "Excluindo..." : "Apagar Conta Definitivamente"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
