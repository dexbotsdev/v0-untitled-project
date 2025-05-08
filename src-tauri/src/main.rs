#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod migrations;

use tauri::Manager;
use tauri_plugin_sql::{Builder, Migration};

fn main() {
  tauri::Builder::default()
    .plugin(
      Builder::default()
        .add_migrations("sqlite", migrations::get_migrations())
        .build(),
    )
    .setup(|app| {
      // You can perform setup tasks here
      #[cfg(debug_assertions)]
      {
        let window = app.get_window("main").unwrap();
        window.open_devtools();
      }
      
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
