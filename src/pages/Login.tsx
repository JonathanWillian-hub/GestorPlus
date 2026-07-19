import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, EyeOff, Eye, ArrowRight, User as UserIcon, Loader2 } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { loginWithEmail, registerWithEmail, loginWithGoogle } = useFinance();
  const navigate = useNavigate();

  const getFriendlyErrorMessage = (error: any) => {
    const code = error?.code || '';
    const message = error?.message || '';

    if (message.includes('API key not valid') || message.includes('apiKey')) {
      return "Chave de API inválida do Firebase. Por favor, configure as suas credenciais reais no arquivo 'src/firebaseconfig.js'.";
    }

    switch (code) {
      case 'auth/invalid-credential':
        return 'E-mail ou senha incorretos. Verifique suas credenciais.';
      case 'auth/user-not-found':
        return 'Nenhum usuário encontrado com este e-mail.';
      case 'auth/wrong-password':
        return 'Senha incorreta. Tente novamente.';
      case 'auth/invalid-email':
        return 'O endereço de e-mail informado é inválido.';
      case 'auth/email-already-in-use':
        return 'Este e-mail já está sendo utilizado por outra conta.';
      case 'auth/weak-password':
        return 'A senha é muito fraca. Ela deve conter pelo menos 6 caracteres.';
      case 'auth/popup-closed-by-user':
        return 'O login com o Google foi cancelado.';
      case 'auth/operation-not-allowed':
        return 'Este método de autenticação não está ativado no console do Firebase.';
      default:
        return 'Ocorreu um erro ao processar. Verifique sua conexão e tente novamente.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (isRegistering) {
        if (!name.trim()) {
          setErrorMsg('Por favor, digite seu nome.');
          setLoading(false);
          return;
        }
        await registerWithEmail(email, password, name);
        // O usuário é logado automaticamente ao se registrar.
        // Redirecionamos para a raiz '/' onde o Layout intercepta e exibe a tela de verificação de e-mail.
        navigate('/');
      } else {
        await loginWithEmail(email, password);
        navigate('/');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-6 md:p-10 font-sans text-on-surface antialiased overflow-hidden relative">
      {/* Abstract Ambient Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-primary-container opacity-10 blur-[100px] animate-pulse" />
        <div className="absolute top-[60%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-tertiary-container opacity-5 blur-[80px]" />
      </div>

      {/* Login Container */}
      <main className="w-full max-w-[440px] relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight mb-1">GestorPlus</h1>
          <p className="text-base text-on-surface-variant">Clareza em cada transação.</p>
        </div>

        {/* Login Card */}
        <div className="glass-panel rounded-[24px] shadow-[0px_10px_30px_rgba(0,0,0,0.5)] p-6 md:p-10 w-full bg-surface-container/80 backdrop-blur-md border border-outline-variant/30">
          <h2 className="text-2xl font-semibold text-on-surface mb-6">
            {isRegistering ? 'Criar nova conta' : 'Bem-vindo de volta'}
          </h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Name Input (Register Only) */}
            {isRegistering && (
              <div className="flex flex-col gap-1">
                <label htmlFor="name" className="text-xs font-semibold tracking-wider text-on-surface-variant">Seu Nome</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline-variant pointer-events-none" />
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="Alex Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-12 pl-10 pr-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none text-base placeholder:text-outline"
                  />
                </div>
              </div>
            )}

            {/* Email Input */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-xs font-semibold tracking-wider text-on-surface-variant">Endereço de Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline-variant pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="exemplo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none text-base placeholder:text-outline"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1 mt-1">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-xs font-semibold tracking-wider text-on-surface-variant">Senha</label>
                {!isRegistering && (
                  <a href="#" onClick={(e) => { e.preventDefault(); alert("A redefinição de senha pode ser efetuada no console do Firebase."); }} className="text-xs font-semibold text-primary hover:text-primary-fixed transition-colors">Esqueceu?</a>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline-variant pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 pl-10 pr-10 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none text-base placeholder:text-outline"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface transition-colors focus:outline-none"
                >
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Status Messages */}
            {errorMsg && (
              <div className="p-3 rounded-lg bg-error-container/20 border border-error/30 text-error text-xs leading-relaxed animate-fade-in mt-2">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-lg bg-success-container/20 border border-success/30 text-primary text-xs leading-relaxed animate-fade-in mt-2">
                {successMsg}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-4 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-on-primary text-sm font-semibold rounded-lg transition-colors duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Carregando...
                </>
              ) : (
                <>
                  {isRegistering ? 'Criar Conta' : 'Entrar'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center py-6">
            <div className="flex-grow border-t border-outline-variant" />
            <span className="flex-shrink-0 mx-4 text-xs font-semibold text-outline">ou continue com</span>
            <div className="flex-grow border-t border-outline-variant" />
          </div>

          {/* Social Logins */}
          <div className="flex gap-4">
            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex-grow h-11 flex items-center justify-center gap-2 rounded-lg border border-outline-variant/50 bg-surface-container-lowest hover:bg-surface-container-low transition-colors text-on-surface text-sm font-semibold cursor-pointer disabled:cursor-not-allowed"
            >
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbBunepPeYJgN4MM4LI4F_KgoQagkZympue75MTl6WQr-6Td6ESGOEwrXQ78Vi10p0CYvjv9prMtDr_SviJh40I1XqQ6sJdsYfNs-5OqDAuM0m-mS6yjpeNZCz8pbTH_h-KhJts68K7FM3hY5yLaAe1FqkT__T0nLeC5BB3sh9RrfYZQvACHPGgQaUOU_k6wbwAynmjuWkMCFXxd5szJqPVAyDx8AcnuD7NMvbSTZif49Yz_swc9hXE4dYC3KpV8hvw42_b--jozk" alt="Google" className="w-5 h-5 animate-none" />
              Google
            </button>
          </div>
        </div>

        {/* Toggle Account Mode */}
        <p className="text-center mt-6 text-sm text-on-surface-variant">
          {isRegistering ? 'Já possui uma conta?' : 'Não tem uma conta?'}{' '}
          <button 
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className="font-semibold text-primary hover:text-primary/80 transition-colors focus:outline-none"
          >
            {isRegistering ? 'Faça Login' : 'Criar Conta'}
          </button>
        </p>
        
        {/* LGPD Footer Links */}
        <div className="flex items-center justify-center gap-3 mt-8 text-xs text-on-surface-variant/60">
          <Link to="/termos" className="hover:text-primary transition-colors">Termos de Serviço</Link>
          <span>&bull;</span>
          <Link to="/privacidade" className="hover:text-primary transition-colors">Política de Privacidade</Link>
        </div>
      </main>
    </div>
  );
}
