export interface Receipt {
    id: number;
    merchant: string;
    date: string;
    payment_method: string;
    currency: string;
    amount: number;
    attachment: string;
    category: string;
    projectid: string | null;
    userid: string | null;
    status: string | null;
    description: string | null;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
  }
  