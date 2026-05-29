import Link from "next/link"

const logoUrl = "https://brdsg.com/img/100/brsl50twbrtoukb1wa_1/C41QqkoZG0OFCglC41P1qNGZiZVRYRfm2Ydco2AcSZw.png"

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-4xl mx-auto section-padding py-8">
        <div className="flex flex-wrap gap-x-8 gap-y-6">
          <div className="flex-1 min-w-[160px]">
            <h4 className="font-semibold text-sm mb-3 text-white">Social Media</h4>
            <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/skyhookcoffee/" target="_blank" rel="noopener noreferrer" className="text-[#BDBDBD] hover:text-white transition-colors">
                <svg viewBox="0 0 512 512" className="w-5 h-5" fill="currentColor"><circle cx="256" cy="255.833" r="80"/><path d="M177.805 176.887c21.154-21.154 49.28-32.93 79.195-32.93s58.04 11.838 79.195 32.992c13.422 13.42 23.01 29.55 28.232 47.55H448.5v-113c0-26.51-20.49-47-47-47h-288c-26.51 0-49 20.49-49 47v113h85.072c5.222-18 14.81-34.19 28.233-47.613zM416.5 147.7c0 7.07-5.73 12.8-12.8 12.8h-38.4c-7.07 0-12.8-5.73-12.8-12.8v-38.4c0-7.07 5.73-12.8 12.8-12.8h38.4c7.07 0 12.8 5.73 12.8 12.8v38.4zM336.195 335.28c-21.154 21.153-49.28 32.678-79.195 32.678s-58.04-11.462-79.195-32.616c-21.115-21.115-32.76-49.842-32.803-78.842H64.5v143c0 26.51 22.49 49 49 49h288c26.51 0 47-22.49 47-49v-143h-79.502c-.043 29-11.687 57.664-32.803 78.78z"/></svg>
              </a>
              <a href="https://www.tiktok.com/@skyhookcoffee.id" target="_blank" rel="noopener noreferrer" className="text-[#BDBDBD] hover:text-white transition-colors">
                <svg viewBox="0 0 512 512" className="w-5 h-5" fill="currentColor"><path d="m406.8 171.1c-.3 0-30.7-.6-56.6-19.6-22.6-16.5-30.4-52.4-31.6-65.7v-1.8h-55v237.3c0 28.5-23.2 51.7-51.7 51.7s-51.7-23.2-51.7-51.7 23.2-51.7 51.7-51.7h17.4v-55h-17.4c-58.8 0-106.7 47.9-106.7 106.7s47.9 106.7 106.7 106.7 106.7-47.9 106.7-106.7v-124.8c39.9 28.7 83.1 29.6 88.1 29.6v-55z"/></svg>
              </a>
              <a href="https://www.youtube.com/@skyhookcoffee" target="_blank" rel="noopener noreferrer" className="text-[#BDBDBD] hover:text-white transition-colors">
                <svg viewBox="0 0 512 512" className="w-5 h-5" fill="currentColor"><path d="M508.6 148.8c0-45-33.1-81.2-74-81.2C379.2 65 322.7 64 265 64h-18c-57.6 0-114.2 1-169.6 3.6C36.6 67.6 3.5 104 3.5 149 1 184.6-.1 220.2 0 255.8c-.1 35.6 1 71.2 3.4 106.9 0 45 33.1 81.5 73.9 81.5 58.2 2.7 117.9 3.9 178.6 3.8 60.8.2 120.3-1 178.6-3.8 40.9 0 74-36.5 74-81.5 2.4-35.7 3.5-71.3 3.4-107 .2-35.6-.9-71.2-3.3-106.9zM207 353.9V157.4l145 98.2-145 98.3z"/></svg>
              </a>
            </div>
          </div>

          <div className="flex-1 min-w-[160px]">
            <h4 className="font-semibold text-sm mb-3 text-white">Contact Us</h4>
            <div className="space-y-2">
              <a href="tel:081774934980" className="flex items-center gap-2 text-[#BDBDBD] hover:text-white text-sm transition-colors">
                <svg viewBox="0 0 512 512" className="w-4 h-4 shrink-0" fill="currentColor"><path d="M260.062 32C138.605 32 40.134 129.7 40.134 250.232c0 41.23 11.532 79.79 31.56 112.687L32 480l121.764-38.682c31.508 17.285 67.745 27.146 106.298 27.146C381.535 468.464 480 370.75 480 250.232 480 129.702 381.535 32 260.062 32zm109.362 301.11c-5.174 12.827-28.574 24.533-38.9 25.072-10.313.547-10.607 7.994-66.84-16.434-56.224-24.434-90.05-83.844-92.718-87.67-2.67-3.812-21.78-31.047-20.75-58.455 1.04-27.413 16.048-40.346 21.405-45.725 5.352-5.387 11.487-6.352 15.233-6.413 4.428-.072 7.296-.132 10.573-.01 3.274.123 8.192-.686 12.45 10.638 4.256 11.323 14.443 39.153 15.746 41.99 1.302 2.838 2.108 6.125.102 9.77-2.012 3.653-3.042 5.935-5.96 9.083-2.936 3.148-6.175 7.042-8.793 9.45-2.92 2.664-5.97 5.57-2.9 11.268 3.07 5.693 13.654 24.356 29.78 39.736 20.725 19.77 38.598 26.33 44.098 29.317 5.515 3.004 8.806 2.67 12.226-.93 3.404-3.598 14.64-15.745 18.596-21.168 3.955-5.44 7.66-4.374 12.742-2.33 5.078 2.052 32.157 16.556 37.673 19.55 5.51 2.99 9.193 4.53 10.51 6.9 1.317 2.38.9 13.532-4.27 26.36z"/></svg>
                081774934980
              </a>
              <a href="mailto:ciptaabadifuturistik@gmail.com" className="flex items-center gap-2 text-[#BDBDBD] hover:text-white text-sm transition-colors">
                <svg viewBox="30 30 450 450" className="w-4 h-4 shrink-0" fill="currentColor"><path d="M448 384V141.8l-131.1 99.8L385 319l-2 2-78.9-69.6L256 288l-48.1-36.6L129 321l-2-2 68-77.4L64 142v242z"/><path d="M439.7 128H72l184 139.9z"/></svg>
                ciptaabadifuturistik@gmail.com
              </a>
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <h4 className="font-semibold text-sm mb-3 text-white">Our Location</h4>
            <p className="text-[#BDBDBD] text-sm leading-relaxed">
              Jl. Pusdiklat Depnaker No.23, RW.6, Pinang Ranti, Kec. Makasar, Kota Jakarta Timur 13560
            </p>
          </div>

          <div className="flex-1 min-w-[120px]">
            <h4 className="font-semibold text-sm mb-3 text-white">Links</h4>
            <div className="space-y-2">
              <Link href="/reservasi" className="block text-[#BDBDBD] hover:text-white text-sm transition-colors">Reservation</Link>
              <Link href="/career" className="block text-[#BDBDBD] hover:text-white text-sm transition-colors">Career</Link>
              <a href="https://www.google.com/maps/dir//Skyhook+Coffee+Rooftop+House+and+Kitchen" target="_blank" rel="noopener noreferrer" className="block text-[#BDBDBD] hover:text-white text-sm transition-colors">Location</a>
            </div>
          </div>
        </div>

        <div className="text-center text-[#BDBDBD] text-xs mt-8 pt-6 border-t border-white/10">
          &copy; 2026 skyhookcoffee.com Inc.
        </div>
      </div>
    </footer>
  )
}
