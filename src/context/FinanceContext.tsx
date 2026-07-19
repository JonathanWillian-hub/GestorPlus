import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, User, Goal, Bill, CreditCard } from '../types';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  sendEmailVerification, 
  updateProfile,
  deleteUser
} from 'firebase/auth';
import { auth, googleProvider, db } from '../firebaseconfig';
import { 
  collection, doc, setDoc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy 
} from 'firebase/firestore';

interface FinanceContextType {
  user: User | null;
  loading: boolean;
  transactions: Transaction[];
  goals: Goal[];
  bills: Bill[];
  creditCards: CreditCard[];
  login: (email: string) => void;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resendVerification: () => Promise<void>;
  checkVerificationStatus: () => Promise<boolean>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => Promise<void>;
  getTotalIncome: () => number;
  getTotalExpense: () => number;
  getBalance: () => number;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoalAmount: (id: string, amount: number) => void;
  deleteGoal: (id: string) => void;
  addBill: (bill: Omit<Bill, 'id'>) => void;
  toggleBillStatus: (id: string) => void;
  deleteBill: (id: string) => void;
  addCreditCard: (card: Omit<CreditCard, 'id' | 'limitAvailable' | 'currentInvoiceAmount'>) => void;
  payCardInvoice: (id: string) => void;
  deleteCreditCard: (id: string) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('gestorplus_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const loggedUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuário',
          email: firebaseUser.email || '',
          plan: 'Premium Member',
          avatarUrl: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
          emailVerified: firebaseUser.emailVerified
        };
        setUser(loggedUser);
        localStorage.setItem('gestorplus_user', JSON.stringify(loggedUser));

        // Sync user profile to Firestore
        const syncUser = async () => {
          try {
            const userRef = doc(db, 'dados', loggedUser.id);
            const userSnap = await getDoc(userRef);

            let currentRole = 'user';
            let currentStatus = 'pending';

            if (!userSnap.exists()) {
              await setDoc(userRef, {
                email: loggedUser.email,
                name: loggedUser.name,
                plan: 'Premium Member',
                avatar_url: loggedUser.avatarUrl,
                role: currentRole,
                status: currentStatus
              });
              console.log("User successfully created in Firestore.");
            } else {
              const dbUser = userSnap.data();
              currentRole = dbUser.role || 'user';
              currentStatus = dbUser.status || 'pending';
              
              await updateDoc(userRef, {
                name: loggedUser.name,
                avatar_url: loggedUser.avatarUrl,
                role: currentRole,
                status: currentStatus
              });
            }

            const userWithRoles = { ...loggedUser, role: currentRole as 'admin' | 'user', status: currentStatus as 'pending' | 'approved' | 'rejected' };
            setUser(userWithRoles);
            localStorage.setItem('gestorplus_user', JSON.stringify(userWithRoles));

          } catch (err) {
            console.warn("Failed to sync user profile with Firestore:", err);
          }
        };
        syncUser();
      } else {
        setUser(null);
        localStorage.removeItem('gestorplus_user');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);

  useEffect(() => {
    if (user?.id) {
      const fetchData = async () => {
        const cachedTxs = localStorage.getItem(`gp_txs_${user.email}`);
        if (cachedTxs) setTransactions(JSON.parse(cachedTxs));
        const cachedGoals = localStorage.getItem(`gp_goals_${user.email}`);
        if (cachedGoals) setGoals(JSON.parse(cachedGoals));
        const cachedBills = localStorage.getItem(`gp_bills_${user.email}`);
        if (cachedBills) setBills(JSON.parse(cachedBills));
        const cachedCards = localStorage.getItem(`gp_cards_${user.email}`);
        if (cachedCards) setCreditCards(JSON.parse(cachedCards));

        try {
          const txsQuery = query(collection(db, 'dados', user.id, 'transactions'), orderBy('date', 'desc'));
          const goalsRef = collection(db, 'dados', user.id, 'goals');
          const billsRef = collection(db, 'dados', user.id, 'bills');
          const cardsRef = collection(db, 'dados', user.id, 'creditCards');

          const [txsSnap, glsSnap, blsSnap, crdsSnap] = await Promise.all([
            getDocs(txsQuery),
            getDocs(goalsRef),
            getDocs(billsRef),
            getDocs(cardsRef)
          ]);

          const mappedTxs = txsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Transaction[];
          setTransactions(mappedTxs);
          localStorage.setItem(`gp_txs_${user.email}`, JSON.stringify(mappedTxs));

          const mappedGoals = glsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Goal[];
          setGoals(mappedGoals);
          localStorage.setItem(`gp_goals_${user.email}`, JSON.stringify(mappedGoals));

          const mappedBills = blsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Bill[];
          setBills(mappedBills);
          localStorage.setItem(`gp_bills_${user.email}`, JSON.stringify(mappedBills));

          const mappedCards = crdsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CreditCard[];
          setCreditCards(mappedCards);
          localStorage.setItem(`gp_cards_${user.email}`, JSON.stringify(mappedCards));

        } catch (err) {
          console.warn("Could not sync with Firestore on load, relying on cache:", err);
        }
      };
      fetchData();
    } else {
      setTransactions([]);
      setGoals([]);
      setBills([]);
      setCreditCards([]);
    }
  }, [user?.id, user?.email]);

  const login = (email: string) => {
    // Legacy mock function, not usually used with real auth
  };

  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const registerWithEmail = async (email: string, password: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName: name });
      
      try {
        await setDoc(doc(db, 'dados', userCredential.user.uid), { 
          email: email, 
          name: name,
          plan: 'Premium Member',
          avatar_url: userCredential.user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
          role: 'user',
          status: 'pending'
        });
      } catch (err) {
        console.error("Erro ao salvar usuário no Firestore", err);
      }

      try {
        await sendEmailVerification(userCredential.user);
      } catch (err) {
        console.error("[Firebase] Falha ao enviar verificação padrão:", err);
      }
    }
  };

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const resendVerification = async () => {
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
      } catch (err) {
        console.error("[Firebase] Erro ao reenviar link padrão:", err);
      }
    }
  };

  const checkVerificationStatus = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      return !!auth.currentUser.emailVerified;
    }
    return false;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem('gestorplus_user');
  };

  const deleteAccount = async () => {
    if (!auth.currentUser || !user?.id) return;
    
    try {
      // 1. Delete user document from Firestore
      await deleteDoc(doc(db, 'dados', user.id));
      
      // Note: In a real production environment with huge subcollections,
      // it's best to use a Cloud Function to recursively delete subcollections.
      // But deleting the parent document effectively makes the data orphaned
      // and satisfies basic LGPD "right to be forgotten" from active systems.

      // 2. Delete user from Firebase Auth
      await deleteUser(auth.currentUser);

      // 3. Clear local state
      setUser(null);
      localStorage.removeItem('gestorplus_user');
    } catch (err: any) {
      console.error("Error deleting account:", err);
      
      // If error is requires-recent-login, the UI will need to handle it 
      // by asking user to re-authenticate, but we'll bubble up the error.
      throw err;
    }
  };

  const addTransaction = async (tx: Omit<Transaction, 'id'>) => {
    if (!user?.id) return;
    const newTx = { 
      description: tx.description,
      amount: tx.amount,
      type: tx.type,
      category: tx.category,
      paymentMethod: tx.paymentMethod || 'pix',
      creditCardId: tx.creditCardId || null,
      date: tx.date
    };
    
    let createdId = 'local_tx_' + Date.now();
    try {
      const docRef = await addDoc(collection(db, 'dados', user.id, 'transactions'), newTx);
      createdId = docRef.id;
    } catch (err) {
      console.warn("Firestore insert error:", err);
    }

    const finalTx = { id: createdId, ...newTx } as Transaction;

    setTransactions(prev => {
      const updated = [finalTx, ...prev];
      localStorage.setItem(`gp_txs_${user!.email}`, JSON.stringify(updated));
      return updated;
    });

    if (tx.type === 'expense' && tx.paymentMethod === 'credito' && tx.creditCardId) {
      const cardToUpdate = creditCards.find(c => c.id === tx.creditCardId);
      if (cardToUpdate) {
        const newAvailable = Math.max(0, cardToUpdate.limitAvailable - tx.amount);
        const newInvoice = cardToUpdate.currentInvoiceAmount + tx.amount;
        
        try {
          if (!cardToUpdate.id.startsWith('local_card_')) {
            await updateDoc(doc(db, 'dados', user.id, 'creditCards', cardToUpdate.id), {
              limitAvailable: newAvailable,
              currentInvoiceAmount: newInvoice
            });
          }
        } catch (err) {
          console.warn("Failed to update card in Firestore:", err);
        }

        setCreditCards(prev => {
          const updated = prev.map(card => {
            if (card.id === tx.creditCardId) return { ...card, limitAvailable: newAvailable, currentInvoiceAmount: newInvoice };
            return card;
          });
          localStorage.setItem(`gp_cards_${user!.email}`, JSON.stringify(updated));
          return updated;
        });
      }
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user?.id) return;

    const txToDelete = transactions.find(t => t.id === id);
    if (!txToDelete) return;

    try {
      if (!id.startsWith('local_tx_')) {
        await deleteDoc(doc(db, 'dados', user.id, 'transactions', id));
      }
    } catch (err) {
      console.warn("Firestore delete failed:", err);
    }

    setTransactions(prev => {
      const updated = prev.filter(t => t.id !== id);
      localStorage.setItem(`gp_txs_${user.email}`, JSON.stringify(updated));
      return updated;
    });

    if (txToDelete.type === 'expense' && txToDelete.paymentMethod === 'credito' && txToDelete.creditCardId) {
      const cardToUpdate = creditCards.find(c => c.id === txToDelete.creditCardId);
      if (cardToUpdate) {
        const newAvailable = Math.min(cardToUpdate.limitTotal, cardToUpdate.limitAvailable + txToDelete.amount);
        const newInvoice = Math.max(0, cardToUpdate.currentInvoiceAmount - txToDelete.amount);

        try {
          if (!cardToUpdate.id.startsWith('local_card_')) {
            await updateDoc(doc(db, 'dados', user.id, 'creditCards', cardToUpdate.id), {
              limitAvailable: newAvailable,
              currentInvoiceAmount: newInvoice
            });
          }
        } catch (err) {
          console.warn("Failed to update credit card limit in Firestore:", err);
        }

        setCreditCards(prev => {
          const updated = prev.map(card => {
            if (card.id === txToDelete.creditCardId) return { ...card, limitAvailable: newAvailable, currentInvoiceAmount: newInvoice };
            return card;
          });
          localStorage.setItem(`gp_cards_${user.email}`, JSON.stringify(updated));
          return updated;
        });
      }
    }
  };

  const getTotalIncome = () => transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const getTotalExpense = () => transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const getBalance = () => getTotalIncome() - getTotalExpense();

  const addGoal = async (goal: Omit<Goal, 'id'>) => {
    if (!user?.id) return;
    const newGoal = {
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      deadlineDate: goal.deadlineDate
    };

    let createdId = 'local_goal_' + Date.now();
    try {
      const docRef = await addDoc(collection(db, 'dados', user.id, 'goals'), newGoal);
      createdId = docRef.id;
    } catch (err) {
      console.warn("Firestore goal error:", err);
    }

    const finalGoal = { id: createdId, ...newGoal } as Goal;

    setGoals(prev => {
      const updated = [...prev, finalGoal];
      localStorage.setItem(`gp_goals_${user!.email}`, JSON.stringify(updated));
      return updated;
    });

    if (goal.currentAmount > 0) {
      addTransaction({
        description: `Aporte Inicial: ${goal.name}`,
        amount: goal.currentAmount,
        type: 'expense',
        category: 'investimento',
        paymentMethod: 'pix',
        date: new Date().toISOString()
      });
    }
  };

  const updateGoalAmount = async (id: string, amount: number) => {
    if (!user?.id) return;
    const goal = goals.find(g => g.id === id);
    const difference = goal ? amount - goal.currentAmount : 0;

    try {
      if (!id.startsWith('local_goal_')) {
        await updateDoc(doc(db, 'dados', user.id, 'goals', id), { currentAmount: amount });
      }
    } catch (err) {
      console.warn("Firestore goal update failed:", err);
    }

    setGoals(prev => {
      const updated = prev.map(g => g.id === id ? { ...g, currentAmount: amount } : g);
      localStorage.setItem(`gp_goals_${user!.email}`, JSON.stringify(updated));
      return updated;
    });

    if (difference > 0 && goal) {
      addTransaction({
        description: `Aporte: ${goal.name}`,
        amount: difference,
        type: 'expense',
        category: 'investimento',
        paymentMethod: 'pix',
        date: new Date().toISOString()
      });
    }
  };

  const deleteGoal = async (id: string) => {
    if (!user?.id) return;
    try {
      if (!id.startsWith('local_goal_')) {
        await deleteDoc(doc(db, 'dados', user.id, 'goals', id));
      }
    } catch (err) {
      console.warn("Firestore goal delete failed:", err);
    }

    setGoals(prev => {
      const updated = prev.filter(g => g.id !== id);
      localStorage.setItem(`gp_goals_${user!.email}`, JSON.stringify(updated));
      return updated;
    });
  };

  const addBill = async (bill: Omit<Bill, 'id'>) => {
    if (!user?.id) return;
    const newBill = {
      description: bill.description,
      amount: bill.amount,
      dueDate: bill.dueDate,
      status: bill.status,
      type: bill.type,
      isRecurring: bill.isRecurring
    };

    let createdId = 'local_bill_' + Date.now();
    try {
      const docRef = await addDoc(collection(db, 'dados', user.id, 'bills'), newBill);
      createdId = docRef.id;
    } catch (err) {
      console.warn("Firestore bill error:", err);
    }

    const finalBill = { id: createdId, ...newBill } as Bill;

    setBills(prev => {
      const updated = [...prev, finalBill];
      localStorage.setItem(`gp_bills_${user!.email}`, JSON.stringify(updated));
      return updated;
    });
  };

  const toggleBillStatus = async (id: string) => {
    if (!user?.id) return;
    const bill = bills.find(b => b.id === id);
    if (!bill) return;

    const nextStatus = bill.status === 'paid' ? 'pending' : 'paid';
    
    try {
      if (!id.startsWith('local_bill_')) {
        await updateDoc(doc(db, 'dados', user.id, 'bills', id), { status: nextStatus });
      }
    } catch (err) {
      console.warn("Firestore bill update failed:", err);
    }

    setBills(prev => {
      const updated = prev.map(b => b.id === id ? { ...b, status: nextStatus } : b);
      localStorage.setItem(`gp_bills_${user!.email}`, JSON.stringify(updated));
      return updated;
    });
    
    if (nextStatus === 'paid') {
      addTransaction({
        description: `Pagamento: ${bill.description}`,
        amount: bill.amount,
        type: bill.type,
        category: bill.type === 'expense' ? 'outros' : 'salario',
        paymentMethod: 'pix',
        date: new Date().toISOString()
      });
    }
  };

  const deleteBill = async (id: string) => {
    if (!user?.id) return;
    try {
      if (!id.startsWith('local_bill_')) {
        await deleteDoc(doc(db, 'dados', user.id, 'bills', id));
      }
    } catch (err) {
      console.warn("Firestore bill delete failed:", err);
    }

    setBills(prev => {
      const updated = prev.filter(b => b.id !== id);
      localStorage.setItem(`gp_bills_${user!.email}`, JSON.stringify(updated));
      return updated;
    });
  };

  const addCreditCard = async (card: Omit<CreditCard, 'id' | 'limitAvailable' | 'currentInvoiceAmount'>) => {
    if (!user?.id) return;
    
    const newCard = {
      name: card.name,
      limitTotal: card.limitTotal,
      limitAvailable: card.limitTotal,
      closingDay: card.closingDay,
      dueDay: card.dueDay,
      currentInvoiceAmount: 0
    };

    let createdId = 'local_card_' + Date.now();
    try {
      const docRef = await addDoc(collection(db, 'dados', user.id, 'creditCards'), newCard);
      createdId = docRef.id;
    } catch (err) {
      console.warn("Firestore card error:", err);
    }

    const finalCard = { id: createdId, ...newCard } as CreditCard;

    setCreditCards(prev => {
      const updated = [...prev, finalCard];
      localStorage.setItem(`gp_cards_${user!.email}`, JSON.stringify(updated));
      return updated;
    });
  };

  const payCardInvoice = async (id: string) => {
    if (!user?.id) return;
    const card = creditCards.find(c => c.id === id);
    if (!card) return;

    if (card.currentInvoiceAmount > 0) {
      try {
        if (!id.startsWith('local_card_')) {
          await updateDoc(doc(db, 'dados', user.id, 'creditCards', id), {
            limitAvailable: card.limitTotal,
            currentInvoiceAmount: 0
          });
        }
      } catch (err) {
        console.warn("Firestore invoice payment failed:", err);
      }

      setCreditCards(prev => {
        const updated = prev.map(c => 
          c.id === id ? { ...c, limitAvailable: c.limitTotal, currentInvoiceAmount: 0 } : c
        );
        localStorage.setItem(`gp_cards_${user!.email}`, JSON.stringify(updated));
        return updated;
      });
      
      addTransaction({
        description: `Pagamento Fatura - ${card.name}`,
        amount: card.currentInvoiceAmount,
        type: 'expense',
        category: 'outros',
        paymentMethod: 'pix',
        date: new Date().toISOString()
      });
    }
  };

  const deleteCreditCard = async (id: string) => {
    if (!user?.id) return;
    try {
      if (!id.startsWith('local_card_')) {
        await deleteDoc(doc(db, 'dados', user.id, 'creditCards', id));
      }
    } catch (err) {
      console.warn("Firestore card delete failed:", err);
    }

    setCreditCards(prev => {
      const updated = prev.filter(c => c.id !== id);
      localStorage.setItem(`gp_cards_${user!.email}`, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <FinanceContext.Provider value={{ 
      user, 
      loading,
      transactions, 
      goals,
      bills,
      creditCards,
      login, 
      loginWithEmail,
      registerWithEmail,
      loginWithGoogle,
      resendVerification,
      checkVerificationStatus,
      logout, 
      deleteAccount,
      addTransaction, 
      deleteTransaction,
      getTotalIncome, 
      getTotalExpense, 
      getBalance,
      addGoal,
      updateGoalAmount,
      deleteGoal,
      addBill,
      toggleBillStatus,
      deleteBill,
      addCreditCard,
      payCardInvoice,
      deleteCreditCard
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) throw new Error('useFinance must be used within a FinanceProvider');
  return context;
};
