#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
JPVIET Audio Creator
Tạo file audio MP3 cho từ vựng tiếng Nhật
"""

import json
import os
import time
from pathlib import Path
import requests
from urllib.parse import quote

class JPVIETAudioCreator:
    def __init__(self):
        self.audio_dir = Path("audio")
        self.vocab_file = Path("data/vocab.json")
        self.audio_dir.mkdir(exist_ok=True)
        
    def load_vocab(self):
        """Tải dữ liệu từ vựng từ JSON"""
        try:
            with open(self.vocab_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"❌ Không tìm thấy file {self.vocab_file}")
            return []
        except json.JSONDecodeError:
            print(f"❌ Lỗi đọc file JSON {self.vocab_file}")
            return []
    
    def create_audio_google_tts(self, text, filename):
        """Tạo audio sử dụng Google Text-to-Speech API"""
        try:
            # Google TTS URL
            url = "https://translate.google.com/translate_tts"
            
            params = {
                'ie': 'UTF-8',
                'q': text,
                'tl': 'ja',  # Japanese
                'client': 'tw-ob',
                'total': '1',
                'idx': '0'
            }
            
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            
            response = requests.get(url, params=params, headers=headers)
            
            if response.status_code == 200:
                audio_path = self.audio_dir / filename
                with open(audio_path, 'wb') as f:
                    f.write(response.content)
                print(f"✅ Đã tạo: {filename}")
                return True
            else:
                print(f"❌ Lỗi API: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Lỗi khi tạo audio: {e}")
            return False
    
    def create_audio_azure_tts(self, text, filename):
        """Tạo audio sử dụng Azure Text-to-Speech (cần API key)"""
        # Azure TTS implementation
        # Cần subscription key và region
        pass
    
    def create_audio_offline(self, text, filename):
        """Tạo audio offline sử dụng espeak hoặc festival"""
        try:
            import subprocess
            
            # Sử dụng espeak nếu có
            audio_path = self.audio_dir / filename
            
            # Thử espeak trước
            try:
                cmd = [
                    'espeak', 
                    '-v', 'ja',  # Japanese voice
                    '-s', '150',  # Speed
                    '-p', '50',   # Pitch
                    '-w', str(audio_path),  # Output file
                    text
                ]
                subprocess.run(cmd, check=True, capture_output=True)
                print(f"✅ Đã tạo (espeak): {filename}")
                return True
            except (subprocess.CalledProcessError, FileNotFoundError):
                pass
            
            # Thử festival nếu espeak không có
            try:
                script_content = f'(utt.save (Utterance Text "{text}") "{audio_path}")'
                cmd = ['festival', '--batch', '--eval', script_content]
                subprocess.run(cmd, check=True, capture_output=True)
                print(f"✅ Đã tạo (festival): {filename}")
                return True
            except (subprocess.CalledProcessError, FileNotFoundError):
                pass
            
            print(f"❌ Không tìm thấy espeak hoặc festival")
            return False
            
        except Exception as e:
            print(f"❌ Lỗi khi tạo audio offline: {e}")
            return False
    
    def create_audio_files(self, method='google'):
        """Tạo audio files cho tất cả từ vựng"""
        vocab_data = self.load_vocab()
        
        if not vocab_data:
            print("❌ Không có dữ liệu từ vựng")
            return
        
        print(f"📚 Tìm thấy {len(vocab_data)} từ vựng")
        print(f"🎵 Sử dụng phương pháp: {method}")
        print("-" * 50)
        
        success_count = 0
        total_count = len(vocab_data)
        
        for i, vocab in enumerate(vocab_data, 1):
            kana = vocab.get('kana', '')
            if not kana:
                continue
                
            # Tạo tên file
            safe_kana = "".join(c for c in kana if c.isalnum() or c in ('あ', 'い', 'う', 'え', 'お'))
            filename = f"{safe_kana}.mp3"
            
            print(f"[{i}/{total_count}] {kana} -> {filename}")
            
            # Kiểm tra file đã tồn tại
            if (self.audio_dir / filename).exists():
                print(f"⏭️  File đã tồn tại: {filename}")
                success_count += 1
                continue
            
            # Tạo audio
            if method == 'google':
                success = self.create_audio_google_tts(kana, filename)
            elif method == 'offline':
                success = self.create_audio_offline(kana, filename)
            else:
                print(f"❌ Phương pháp không hỗ trợ: {method}")
                continue
            
            if success:
                success_count += 1
            
            # Delay để tránh spam API
            if method == 'google':
                time.sleep(1)
            
            print()
        
        print("-" * 50)
        print(f"🎉 Hoàn thành! {success_count}/{total_count} audio files")
        
        # Cập nhật vocab.json với tên file audio
        self.update_vocab_audio_files()
    
    def update_vocab_audio_files(self):
        """Cập nhật vocab.json với tên file audio"""
        try:
            vocab_data = self.load_vocab()
            updated = False
            
            for vocab in vocab_data:
                kana = vocab.get('kana', '')
                if not kana:
                    continue
                
                # Tạo tên file
                safe_kana = "".join(c for c in kana if c.isalnum() or c in ('あ', 'い', 'う', 'え', 'お'))
                filename = f"{safe_kana}.mp3"
                
                # Kiểm tra file tồn tại
                if (self.audio_dir / filename).exists():
                    if vocab.get('audio') != filename:
                        vocab['audio'] = filename
                        updated = True
                else:
                    if vocab.get('audio'):
                        vocab['audio'] = ""
                        updated = True
            
            if updated:
                # Backup file cũ
                backup_file = self.vocab_file.with_suffix('.json.backup')
                if not backup_file.exists():
                    with open(self.vocab_file, 'r', encoding='utf-8') as f:
                        backup_content = f.read()
                    with open(backup_file, 'w', encoding='utf-8') as f:
                        f.write(backup_content)
                    print(f"💾 Đã backup: {backup_file}")
                
                # Ghi file mới
                with open(self.vocab_file, 'w', encoding='utf-8') as f:
                    json.dump(vocab_data, f, ensure_ascii=False, indent=2)
                
                print(f"✅ Đã cập nhật {self.vocab_file}")
            else:
                print(f"ℹ️  Không cần cập nhật {self.vocab_file}")
                
        except Exception as e:
            print(f"❌ Lỗi khi cập nhật vocab.json: {e}")
    
    def list_audio_files(self):
        """Liệt kê các file audio đã tạo"""
        audio_files = list(self.audio_dir.glob("*.mp3"))
        
        if not audio_files:
            print("❌ Không có file audio nào")
            return
        
        print(f"🎵 Tìm thấy {len(audio_files)} file audio:")
        print("-" * 30)
        
        for audio_file in sorted(audio_files):
            size = audio_file.stat().st_size
            size_kb = size / 1024
            print(f"📁 {audio_file.name} ({size_kb:.1f} KB)")
    
    def clean_audio_files(self):
        """Xóa các file audio không sử dụng"""
        vocab_data = self.load_vocab()
        used_audio = set()
        
        # Lấy danh sách audio được sử dụng
        for vocab in vocab_data:
            audio = vocab.get('audio', '')
            if audio:
                used_audio.add(audio)
        
        # Tìm file audio không sử dụng
        all_audio_files = set(f.name for f in self.audio_dir.glob("*.mp3"))
        unused_audio = all_audio_files - used_audio
        
        if not unused_audio:
            print("ℹ️  Không có file audio nào không sử dụng")
            return
        
        print(f"🗑️  Tìm thấy {len(unused_audio)} file audio không sử dụng:")
        for audio in sorted(unused_audio):
            print(f"  - {audio}")
        
        # Xác nhận xóa
        confirm = input("\n❓ Bạn có muốn xóa các file này? (y/N): ")
        if confirm.lower() == 'y':
            deleted_count = 0
            for audio in unused_audio:
                try:
                    (self.audio_dir / audio).unlink()
                    print(f"🗑️  Đã xóa: {audio}")
                    deleted_count += 1
                except Exception as e:
                    print(f"❌ Lỗi khi xóa {audio}: {e}")
            
            print(f"✅ Đã xóa {deleted_count} file audio")
        else:
            print("❌ Đã hủy xóa file")

def main():
    """Main function"""
    print("🎵 JPVIET Audio Creator")
    print("=" * 40)
    
    creator = JPVIETAudioCreator()
    
    while True:
        print("\n📋 Menu:")
        print("1. Tạo audio files (Google TTS)")
        print("2. Tạo audio files (Offline)")
        print("3. Liệt kê file audio")
        print("4. Cập nhật vocab.json")
        print("5. Dọn dẹp file audio")
        print("6. Thoát")
        
        choice = input("\n👉 Chọn tùy chọn (1-6): ").strip()
        
        if choice == '1':
            print("\n🚀 Tạo audio files sử dụng Google TTS...")
            creator.create_audio_files(method='google')
            
        elif choice == '2':
            print("\n💻 Tạo audio files offline...")
            creator.create_audio_files(method='offline')
            
        elif choice == '3':
            print("\n📁 Liệt kê file audio...")
            creator.list_audio_files()
            
        elif choice == '4':
            print("\n🔄 Cập nhật vocab.json...")
            creator.update_vocab_audio_files()
            
        elif choice == '5':
            print("\n🧹 Dọn dẹp file audio...")
            creator.clean_audio_files()
            
        elif choice == '6':
            print("\n👋 Tạm biệt!")
            break
            
        else:
            print("❌ Lựa chọn không hợp lệ!")

if __name__ == "__main__":
    main()
