import React, { useEffect, useState } from 'react';
import { db } from '../firebaseconfig';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { CheckCircle, XCircle, Shield, Clock } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { useNavigate } from 'react-router-dom';

interface DBUser {
  id: string;
  email: string;
  name: string;
  plan: string;
  avatar_url: string;
  role: string;
  status: string;
  created_at: string;
}

const AdminUsers: React.FC = () => {
  const { user } = useFinance();
  const navigate = useNavigate();
  const [users, setUsers] = useState<DBUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const dadosRef = collection(db, 'dados');
      const snapshot = await getDocs(dadosRef);

      const fetchedUsers: DBUser[] = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as DBUser[];

      // Sort by created_at descending (newest first)
      fetchedUsers.sort((a, b) => {
        if (!a.created_at && !b.created_at) return 0;
        if (!a.created_at) return 1;
        if (!b.created_at) return -1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setUsers(fetchedUsers);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError('Erro ao carregar usuários. Verifique as permissões do Firestore.');
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'dados', userId), { status: newStatus });
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    } catch (err: any) {
      console.error('Error updating status:', err);
      alert('Erro ao atualizar status do usuário.');
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, 'dados', userId), { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err: any) {
      console.error('Error updating role:', err);
      alert('Erro ao atualizar papel do usuário.');
    }
  };

  if (user?.role !== 'admin') return null;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface flex items-center gap-2">
            <Shield className="text-primary w-6 h-6" />
            Administração de Usuários
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Aprove ou bloqueie o acesso dos usuários à plataforma.
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="text-sm px-4 py-2 bg-surface-variant text-on-surface hover:bg-outline-variant rounded-lg transition-colors"
        >
          Atualizar
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-error/10 text-error text-sm border border-error/20">
          {error}
        </div>
      )}

      <div className="bg-surface rounded-2xl border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-variant/30 text-on-surface-variant text-sm">
                <th className="p-4 font-medium">Usuário</th>
                <th className="p-4 font-medium">Data de Cadastro</th>
                <th className="p-4 font-medium">Papel</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-on-surface-variant">
                    Carregando usuários...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-on-surface-variant">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u.id} className="border-b border-outline-variant/50 hover:bg-surface-variant/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {u.avatar_url ? (
                          <img src={u.avatar_url} alt={u.name} className="w-10 h-10 rounded-full object-cover border border-outline-variant" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                            {u.name?.charAt(0) || u.email?.charAt(0) || '?'}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-on-surface">{u.name}</div>
                          <div className="text-xs text-on-surface-variant">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-on-surface-variant">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="p-4">
                      <select 
                        value={u.role || 'user'} 
                        onChange={(e) => updateUserRole(u.id, e.target.value)}
                        className="bg-surface-variant text-on-surface text-sm rounded-lg p-2 border border-outline-variant focus:border-primary outline-none"
                        disabled={u.id === user?.id}
                      >
                        <option value="user">Usuário</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        u.status === 'approved' ? 'bg-secondary/10 text-secondary' :
                        u.status === 'rejected' ? 'bg-error/10 text-error' :
                        'bg-amber-500/10 text-amber-500'
                      }`}>
                        {u.status === 'approved' ? <CheckCircle className="w-3.5 h-3.5" /> :
                         u.status === 'rejected' ? <XCircle className="w-3.5 h-3.5" /> :
                         <Clock className="w-3.5 h-3.5" />}
                        {u.status === 'approved' ? 'Aprovado' :
                         u.status === 'rejected' ? 'Bloqueado' :
                         'Pendente'}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      {u.id !== user?.id && (
                        <div className="flex items-center justify-end gap-2">
                          {u.status !== 'approved' && (
                            <button
                              onClick={() => updateUserStatus(u.id, 'approved')}
                              className="p-2 text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
                              title="Aprovar Usuário"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          )}
                          {u.status !== 'rejected' && (
                            <button
                              onClick={() => updateUserStatus(u.id, 'rejected')}
                              className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                              title="Bloquear Usuário"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
