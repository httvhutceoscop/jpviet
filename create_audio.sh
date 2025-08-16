#!/bin/bash

# JPVIET Audio Creator Script
# Tạo file audio MP3 cho từ vựng tiếng Nhật

echo "🎵 JPVIET Audio Creator"
echo "========================"

# Kiểm tra thư mục audio
AUDIO_DIR="audio"
if [ ! -d "$AUDIO_DIR" ]; then
    echo "📁 Tạo thư mục audio..."
    mkdir -p "$AUDIO_DIR"
fi

# Kiểm tra file vocab.json
VOCAB_FILE="data/vocab.json"
if [ ! -f "$VOCAB_FILE" ]; then
    echo "❌ Không tìm thấy file $VOCAB_FILE"
    exit 1
fi

# Hàm tạo audio sử dụng curl
create_audio_curl() {
    local text="$1"
    local filename="$2"
    
    echo "🎤 Đang tạo audio cho: $text"
    
    # Sử dụng Google TTS
    local url="https://translate.google.com/translate_tts"
    local params="ie=UTF-8&q=$text&tl=ja&client=tw-ob&total=1&idx=0"
    
    if curl -s -L -o "$AUDIO_DIR/$filename" "$url?$params" --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"; then
        echo "✅ Đã tạo: $filename"
        return 0
    else
        echo "❌ Lỗi khi tạo: $filename"
        return 1
    fi
}

# Hàm tạo audio sử dụng wget
create_audio_wget() {
    local text="$1"
    local filename="$2"
    
    echo "🎤 Đang tạo audio cho: $text"
    
    # Sử dụng Google TTS
    local url="https://translate.google.com/translate_tts"
    local params="ie=UTF-8&q=$text&tl=ja&client=tw-ob&total=1&idx=0"
    
    if wget -q -O "$AUDIO_DIR/$filename" "$url?$params" --user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"; then
        echo "✅ Đã tạo: $filename"
        return 0
    else
        echo "❌ Lỗi khi tạo: $filename"
        return 1
    fi
}

# Hàm tạo audio sử dụng say (macOS)
create_audio_say() {
    local text="$1"
    local filename="$2"
    
    echo "🎤 Đang tạo audio cho: $text"
    
    if say -v "Kyoko" -o "$AUDIO_DIR/$filename" "$text"; then
        echo "✅ Đã tạo: $filename"
        return 0
    else
        echo "❌ Lỗi khi tạo: $filename"
        return 1
    fi
}

# Hàm tạo audio sử dụng espeak
create_audio_espeak() {
    local text="$1"
    local filename="$2"
    
    echo "🎤 Đang tạo audio cho: $text"
    
    if espeak -v ja -s 150 -p 50 -w "$AUDIO_DIR/$filename" "$text"; then
        echo "✅ Đã tạo: $filename"
        return 0
    else
        echo "❌ Lỗi khi tạo: $filename"
        return 1
    fi
}

# Hàm chọn phương pháp tạo audio
select_audio_method() {
    echo ""
    echo "📋 Chọn phương pháp tạo audio:"
    echo "1. curl (Google TTS)"
    echo "2. wget (Google TTS)"
    echo "3. say (macOS)"
    echo "4. espeak (Linux)"
    echo "5. Thoát"
    
    read -p "👉 Chọn tùy chọn (1-5): " choice
    
    case $choice in
        1) echo "🚀 Sử dụng curl với Google TTS"; return "curl" ;;
        2) echo "🚀 Sử dụng wget với Google TTS"; return "wget" ;;
        3) echo "🍎 Sử dụng say (macOS)"; return "say" ;;
        4) echo "🐧 Sử dụng espeak (Linux)"; return "espeak" ;;
        5) echo "👋 Tạm biệt!"; exit 0 ;;
        *) echo "❌ Lựa chọn không hợp lệ!"; select_audio_method ;;
    esac
}

# Hàm tạo tất cả audio files
create_all_audio() {
    local method="$1"
    
    echo ""
    echo "📚 Đang tải dữ liệu từ vựng..."
    
    # Đọc vocab.json và trích xuất kana
    local vocab_list=$(jq -r '.[] | select(.kana != null and .kana != "") | .kana' "$VOCAB_FILE" 2>/dev/null)
    
    if [ -z "$vocab_list" ]; then
        echo "❌ Không thể đọc dữ liệu từ vựng"
        return 1
    fi
    
    local total=$(echo "$vocab_list" | wc -l)
    local current=0
    local success=0
    
    echo "🎯 Tìm thấy $total từ vựng"
    echo "🎵 Sử dụng phương pháp: $method"
    echo "----------------------------------------"
    
    while IFS= read -r kana; do
        [ -z "$kana" ] && continue
        
        current=$((current + 1))
        echo "[$current/$total] $kana"
        
        # Tạo tên file an toàn
        local safe_kana=$(echo "$kana" | sed 's/[^a-zA-Z0-9あいうえお]/_/g')
        local filename="${safe_kana}.mp3"
        
        # Kiểm tra file đã tồn tại
        if [ -f "$AUDIO_DIR/$filename" ]; then
            echo "⏭️  File đã tồn tại: $filename"
            success=$((success + 1))
            continue
        fi
        
        # Tạo audio theo phương pháp đã chọn
        case $method in
            "curl") create_audio_curl "$kana" "$filename" && success=$((success + 1)) ;;
            "wget") create_audio_wget "$kana" "$filename" && success=$((success + 1)) ;;
            "say") create_audio_say "$kana" "$filename" && success=$((success + 1)) ;;
            "espeak") create_audio_espeak "$kana" "$filename" && success=$((success + 1)) ;;
        esac
        
        # Delay để tránh spam API
        if [ "$method" = "curl" ] || [ "$method" = "wget" ]; then
            sleep 1
        fi
        
        echo ""
    done <<< "$vocab_list"
    
    echo "----------------------------------------"
    echo "🎉 Hoàn thành! $success/$total audio files"
}

# Hàm liệt kê file audio
list_audio_files() {
    echo ""
    echo "📁 Liệt kê file audio:"
    echo "----------------------"
    
    if [ -z "$(ls -A $AUDIO_DIR/*.mp3 2>/dev/null)" ]; then
        echo "❌ Không có file audio nào"
        return
    fi
    
    local count=0
    for file in "$AUDIO_DIR"/*.mp3; do
        if [ -f "$file" ]; then
            local size=$(du -h "$file" | cut -f1)
            echo "📁 $(basename "$file") ($size)"
            count=$((count + 1))
        fi
    done
    
    echo "----------------------"
    echo "🎵 Tổng cộng: $count file audio"
}

# Hàm cập nhật vocab.json
update_vocab_audio() {
    echo ""
    echo "🔄 Cập nhật vocab.json..."
    
    if ! command -v jq &> /dev/null; then
        echo "❌ Cần cài đặt jq để cập nhật vocab.json"
        echo "   Ubuntu/Debian: sudo apt install jq"
        echo "   macOS: brew install jq"
        return 1
    fi
    
    # Backup file cũ
    if [ ! -f "${VOCAB_FILE}.backup" ]; then
        cp "$VOCAB_FILE" "${VOCAB_FILE}.backup"
        echo "💾 Đã backup: ${VOCAB_FILE}.backup"
    fi
    
    # Cập nhật audio field cho mỗi vocab
    local temp_file=$(mktemp)
    jq '.[] | .audio = (.kana | gsub("[^a-zA-Z0-9あいうえお]"; "_")) + ".mp3"' "$VOCAB_FILE" > "$temp_file"
    
    if [ $? -eq 0 ]; then
        mv "$temp_file" "$VOCAB_FILE"
        echo "✅ Đã cập nhật $VOCAB_FILE"
    else
        echo "❌ Lỗi khi cập nhật vocab.json"
        rm -f "$temp_file"
    fi
}

# Hàm dọn dẹp file audio
clean_audio_files() {
    echo ""
    echo "🧹 Dọn dẹp file audio..."
    
    # Đọc danh sách audio được sử dụng từ vocab.json
    local used_audio=$(jq -r '.[] | select(.audio != null and .audio != "") | .audio' "$VOCAB_FILE" 2>/dev/null)
    
    if [ -z "$used_audio" ]; then
        echo "❌ Không thể đọc danh sách audio được sử dụng"
        return 1
    fi
    
    # Tìm file audio không sử dụng
    local unused_files=()
    for file in "$AUDIO_DIR"/*.mp3; do
        if [ -f "$file" ]; then
            local basename_file=$(basename "$file")
            if ! echo "$used_audio" | grep -q "^$basename_file$"; then
                unused_files+=("$file")
            fi
        fi
    done
    
    if [ ${#unused_files[@]} -eq 0 ]; then
        echo "ℹ️  Không có file audio nào không sử dụng"
        return
    fi
    
    echo "🗑️  Tìm thấy ${#unused_files[@]} file audio không sử dụng:"
    for file in "${unused_files[@]}"; do
        echo "  - $(basename "$file")"
    done
    
    read -p "❓ Bạn có muốn xóa các file này? (y/N): " confirm
    if [[ $confirm =~ ^[Yy]$ ]]; then
        local deleted=0
        for file in "${unused_files[@]}"; do
            if rm "$file"; then
                echo "🗑️  Đã xóa: $(basename "$file")"
                deleted=$((deleted + 1))
            else
                echo "❌ Lỗi khi xóa: $(basename "$file")"
            fi
        done
        echo "✅ Đã xóa $deleted file audio"
    else
        echo "❌ Đã hủy xóa file"
    fi
}

# Main menu
main_menu() {
    while true; do
        echo ""
        echo "📋 Menu chính:"
        echo "1. Tạo audio files"
        echo "2. Liệt kê file audio"
        echo "3. Cập nhật vocab.json"
        echo "4. Dọn dẹp file audio"
        echo "5. Thoát"
        
        read -p "👉 Chọn tùy chọn (1-5): " choice
        
        case $choice in
            1)
                method=$(select_audio_method)
                create_all_audio "$method"
                ;;
            2)
                list_audio_files
                ;;
            3)
                update_vocab_audio
                ;;
            4)
                clean_audio_files
                ;;
            5)
                echo "👋 Tạm biệt!"
                exit 0
                ;;
            *)
                echo "❌ Lựa chọn không hợp lệ!"
                ;;
        esac
    done
}

# Kiểm tra dependencies
check_dependencies() {
    echo "🔍 Kiểm tra dependencies..."
    
    local missing_deps=()
    
    # Kiểm tra jq
    if ! command -v jq &> /dev/null; then
        missing_deps+=("jq")
    fi
    
    # Kiểm tra ít nhất một phương pháp tạo audio
    if ! command -v curl &> /dev/null && ! command -v wget &> /dev/null && ! command -v say &> /dev/null && ! command -v espeak &> /dev/null; then
        missing_deps+=("audio_tool")
    fi
    
    if [ ${#missing_deps[@]} -gt 0 ]; then
        echo "⚠️  Thiếu dependencies:"
        for dep in "${missing_deps[@]}"; do
            case $dep in
                "jq")
                    echo "   - jq: Cần để xử lý JSON"
                    echo "     Ubuntu/Debian: sudo apt install jq"
                    echo "     macOS: brew install jq"
                    ;;
                "audio_tool")
                    echo "   - Cần ít nhất một công cụ tạo audio:"
                    echo "     - curl hoặc wget: Google TTS"
                    echo "     - say: macOS Text-to-Speech"
                    echo "     - espeak: Linux Text-to-Speech"
                    ;;
            esac
        done
        echo ""
        read -p "❓ Tiếp tục? (y/N): " continue_choice
        if [[ ! $continue_choice =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        echo "✅ Tất cả dependencies đã sẵn sàng"
    fi
}

# Chạy script
check_dependencies
main_menu
