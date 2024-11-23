export type Command = {
  id: string
  user_id: string
  command: string
  description?: string
  created_at: string
  tags?: Tag[]
}

export type Tag = {
  id: string
  name: string
  user_id: string
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
      tags: {
        Row: Tag
        Insert: Omit<Tag, 'id' | 'created_at'>
        Update: Partial<Omit<Tag, 'id' | 'created_at'>>
      }
      command_tags: {
        Row: {
          command_id: string
          tag_id: string
        }
        Insert: {
          command_id: string
          tag_id: string
        }
        Update: {
          command_id?: string
          tag_id?: string
        }
      }
    }
  }
}
