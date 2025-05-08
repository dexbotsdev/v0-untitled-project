use tauri_plugin_sql::{Migration, MigrationKind};

pub fn get_db_path() -> String {
    let app_dir = tauri::api::path::app_dir(&tauri::Config::default())
        .expect("Failed to get app directory");
    
    app_dir
        .join("bossbundler.db")
        .to_str()
        .expect("Invalid path")
        .to_string()
}

pub fn get_migrations() -> Vec<Migration> {
    log::info!("Loading database migrations");
    vec![
        Migration {
            version: 1,
            description: "create_wallet_table",
            sql: r#"
            CREATE TABLE IF NOT EXISTS wallet (
                id TEXT PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                address TEXT NOT NULL,
                private_key TEXT NOT NULL,
                encrypted BOOLEAN NOT NULL DEFAULT 0,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );"#,
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create_token_table",
            sql: r#"
            CREATE TABLE IF NOT EXISTS token (
                id TEXT PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                symbol TEXT NOT NULL,
                address TEXT NOT NULL,
                chain TEXT NOT NULL,
                decimals INTEGER NOT NULL DEFAULT 18,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );"#,
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "create_volume_bot_table",
            sql: r#"
            CREATE TABLE IF NOT EXISTS volume_bot (
                id TEXT PRIMARY KEY NOT NULL,
                token_id TEXT NOT NULL,
                wallet_id TEXT NOT NULL,
                state TEXT NOT NULL DEFAULT 'paused',
                settings TEXT NOT NULL,
                stats TEXT NOT NULL DEFAULT '{}',
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (token_id) REFERENCES token (id) ON DELETE CASCADE,
                FOREIGN KEY (wallet_id) REFERENCES wallet (id) ON DELETE CASCADE
            );"#,
            kind: MigrationKind::Up,
        },
        Migration {
            version: 4,
            description: "create_transaction_table",
            sql: r#"
            CREATE TABLE IF NOT EXISTS transaction (
                id TEXT PRIMARY KEY NOT NULL,
                bot_id TEXT NOT NULL,
                hash TEXT,
                amount TEXT NOT NULL,
                status TEXT NOT NULL,
                error TEXT,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (bot_id) REFERENCES volume_bot (id) ON DELETE CASCADE
            );"#,
            kind: MigrationKind::Up,
        },
        Migration {
            version: 5,
            description: "create_license_table",
            sql: r#"
            CREATE TABLE IF NOT EXISTS license (
                id TEXT PRIMARY KEY NOT NULL,
                key TEXT NOT NULL,
                status TEXT NOT NULL,
                expires_at TIMESTAMP,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );"#,
            kind: MigrationKind::Up,
        },
        Migration {
            version: 6,
            description: "create_settings_table",
            sql: r#"
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY NOT NULL,
                value TEXT NOT NULL,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );"#,
            kind: MigrationKind::Up,
        },
        Migration {
            version: 7,
            description: "add_bot_logs_table",
            sql: r#"
            CREATE TABLE IF NOT EXISTS bot_log (
                id TEXT PRIMARY KEY NOT NULL,
                bot_id TEXT NOT NULL,
                level TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (bot_id) REFERENCES volume_bot (id) ON DELETE CASCADE
            );"#,
            kind: MigrationKind::Up,
        },
        Migration {
            version: 8,
            description: "add_state_history_to_volume_bot",
            sql: r#"
            CREATE TABLE IF NOT EXISTS bot_state_history (
                id TEXT PRIMARY KEY NOT NULL,
                bot_id TEXT NOT NULL,
                previous_state TEXT NOT NULL,
                new_state TEXT NOT NULL,
                reason TEXT,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (bot_id) REFERENCES volume_bot (id) ON DELETE CASCADE
            );"#,
            kind: MigrationKind::Up,
        },
        Migration {
            version: 9,
            description: "add_schedule_to_volume_bot",
            sql: r#"
            ALTER TABLE volume_bot
            ADD COLUMN schedule TEXT;
            "#,
            kind: MigrationKind::Up,
        },
    ]
}
