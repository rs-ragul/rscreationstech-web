import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Send, CheckCircle, MapPin, Github, Linkedin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Seo } from "@/components/seo/Seo";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("contact_messages").insert([formData]);
      if (error) throw error;

      setIsSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Seo
        title="Contact Ragul S - Get In Touch"
        description="Contact Ragul S - Full Stack Developer & Cybersecurity Enthusiast. Reach out for collaboration, project discussions, or technical conversations."
        path="/contact"
        keywords="contact Ragul S, Ragul S email, hire Ragul, Ragul developer contact"
      />
      <section className="py-24 min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, hsl(187 85% 53% / 0.04) 0%, transparent 60%)",
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Premium Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <div className="section-badge mb-6">
                <Mail className="w-4 h-4" />
                Get In Touch
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-5">
                Let's <span className="gradient-text-mesh">Connect</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Have a question or want to work together? Feel free to reach out!
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="md:col-span-2 space-y-5"
              >
                {/* Email Card */}
                <div className="glass-card p-6 glass-card-hover animated-border">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Email</div>
                      <a
                        href="mailto:rscreations.tech@gmail.com"
                        className="text-sm font-medium hover:text-primary transition-colors"
                      >
                        rscreations.tech@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Location Card */}
                <div className="glass-card p-6 glass-card-hover animated-border">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Location</div>
                      <div className="text-sm font-medium">Tamil Nadu, India</div>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="glass-card p-6 animated-border">
                  <h3 className="text-sm font-medium mb-4">Connect with me</h3>
                  <div className="flex items-center gap-3">
                    {[
                      { href: "https://github.com/rs-ragul", icon: Github, label: "GitHub" },
                      { href: "https://www.linkedin.com/in/ragul-rs/", icon: Linkedin, label: "LinkedIn" },
                      { href: "mailto:rscreations.tech@gmail.com", icon: Mail, label: "Email" },
                    ].map((link) => (
                      <motion.a
                        key={link.label}
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-11 h-11 rounded-xl bg-muted/30 border border-border/30 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/25 hover:bg-primary/8 transition-all duration-300"
                        aria-label={link.label}
                      >
                        <link.icon className="w-4 h-4" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="md:col-span-3"
              >
                <div className="glass-card p-7 animated-border">
                  {isSubmitted ? (
                    <div className="text-center py-10">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-16 h-16 mx-auto mb-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center"
                      >
                        <CheckCircle className="w-8 h-8 text-primary" />
                      </motion.div>
                      <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                      <p className="text-muted-foreground mb-6">
                        Thank you for reaching out. I'll get back to you as soon as possible.
                      </p>
                      <Button onClick={() => setIsSubmitted(false)} variant="outline" className="btn-premium">
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                          Name
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="bg-background/40 border-border/30 h-11 rounded-xl focus:border-primary/30 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="bg-background/40 border-border/30 h-11 rounded-xl focus:border-primary/30 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-sm font-medium">
                          Message
                        </Label>
                        <Textarea
                          id="message"
                          placeholder="Your message..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                          rows={6}
                          className="bg-background/40 border-border/30 rounded-xl resize-none focus:border-primary/30 transition-all"
                        />
                      </div>
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full btn-premium bg-gradient-to-r from-primary to-cyan-400 hover:from-cyan-400 hover:to-primary transition-all duration-500 shadow-lg shadow-primary/20 h-12"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          "Sending..."
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
