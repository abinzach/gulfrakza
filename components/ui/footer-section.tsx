"use client"


import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import { Logo } from "@/app/components/Navbar"
import Link from "next/link"


function Footerdemo() {

  return (
    <footer className="relative border-t px-4  md:px-6 bg-background text-foreground transition-colors duration-300">
      <div className="container max-w-7xl mx-auto  py-12 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
          <Logo/>
          
            <p className="mb-6 text-xs font-inter text-gray-800 ">
              Connecting Markets, Empowering Growth
            </p>
            <p  className="text-sm  font-inter text-gray-800 ">Rakzah Gulf Trading Establishment</p>
            <p  className="text-xl font-inter text-gray-800 ">مؤسسة ركزة الخليج للتجارة
            </p>

            <p  className="mb-6 text-sm  font-inter text-gray-800 "> C.R. 2050194171</p>
           
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <nav className="space-y-2 text-sm">
              <Link href="/" className="block transition-colors hover:text-primary">
                Home
              </Link>
              <Link href="/about-us" className="block transition-colors hover:text-primary">
                About Us
              </Link>
              <Link href="/#services" className="block transition-colors hover:text-primary">
                Services
              </Link>
              <Link href="/products" className="block transition-colors hover:text-primary">
                Products
              </Link>
              <Link href="#" className="block transition-colors hover:text-primary">
                Contact
              </Link>
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
            <address className="space-y-2 text-sm not-italic">
                          <p>Salem Balhamer Building,              </p>
              <p>2nd Floor, Office #9,</p>
              <p>Al Tubayshi District,</p>
              <p>Dammam 32233</p>
              <p>Phone: (013) 881 6957</p>
              <p>Phone: +966 - 558 975 494</p>
              <p>Email: sales@gulfrakza.com</p>
            </address>
          </div>
          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold">Follow Us</h3>
            <div className="mb-6 flex space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Facebook className="h-4 w-4" />
                      <span className="sr-only">Facebook</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Facebook</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Twitter className="h-4 w-4" />
                      <span className="sr-only">Twitter</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Twitter</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Instagram className="h-4 w-4" />
                      <span className="sr-only">Instagram</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Instagram</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Linkedin className="h-4 w-4" />
                      <span className="sr-only">LinkedIn</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Connect with us on LinkedIn</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
           
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2024 GulfRakza. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm">
            <Link href="/privacy-policy" className="transition-colors hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="transition-colors hover:text-primary">
              Terms of Service
            </Link>
      
          </nav>
        </div>
      </div>
    </footer>
  )
}

export { Footerdemo }
