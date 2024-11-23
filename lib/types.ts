export type Command = {
  id: string
  user_id: string
  command: string
  description?: string
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      commands: {
        Row: Command
        Insert: Omit<Command, 'id' | 'created_at'>
        Update: Partial<Omit<Command, 'id' | 'created_at'>>
      }
    }
  }
}
