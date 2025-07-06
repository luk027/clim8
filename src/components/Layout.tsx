import type { PropsWithChildren } from "react"
import Header from "./Header"

const Layout = ({children}: PropsWithChildren) => {
  return (
    <div className="bg-gradient-to-br from-background to-muted">
        <Header />

        <main className="min-h-screen container mx-auto px-4 py-8">
            {children}
        </main>
        
        <footer className="border-t backdrop-blur py-6 supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 text-center text-gray-400">
                <p>
                    Made with 💖 by <a href="https://github.com/luk027" target="_blank" className="hover:underline">luk027</a>
                </p>
            </div>
        </footer>
        
    </div>
  )
}

export default Layout