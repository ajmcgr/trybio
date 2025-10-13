import Header from "@/components/Header";
import Footer from "@/components/Footer";
import alexAvatar from "@/assets/alex-avatar.png";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-20 px-6">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-display font-medium mb-6 text-center">Our story</h1>
          
          <p className="text-xl text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
            We started this to empower storytellers around the world with the most advanced bio page technology that just works.
          </p>

          <div className="prose prose-lg max-w-none">
            <p className="text-lg mb-6">
              <strong>Hello there!</strong>
            </p>

            <p className="mb-6">
              I'm Alex MacGregor, a PR strategist who has spent the last decade relying on enterprise suites like Meltwater, Cision, and Muck Rack to get coverage for tech brands across Asia-Pacific.
            </p>

            <p className="mb-6">
              Those platforms were revolutionary once, but somewhere along the way they traded focus for feature bloat. Pricing climbed, dashboards grew dense, and the contact lists still missed too many key reporters. I found myself wrestling with Boolean strings from the 2010s while the industry around us moved to natural-language prompts and AI-assisted workflows.
            </p>

            <p className="mb-6">
              That frustration became the spark for Bio. We're building a lean, AI-first bio page platform that prizes speed, accuracy, and transparency over shiny add-ons.
            </p>

            <p className="mb-6">
              Imagine describing your personal brand the way you'd brief a colleague—and seeing a stunning bio page created in seconds, not hours. Then imagine paying a fair, cancel-anytime rate for that clarity instead of an annual contract padded with modules you'll never open.
            </p>

            <p className="mb-6">
              Our small team writes code in the daylight and verifies data at night, propelled by a simple goal: help you share your story without the busywork. We'd rather invest in product improvements than celebrity keynotes; rather answer a customer email than craft another upsell deck.
            </p>

            <p className="mb-6">
              Above all, we believe the best software feels invisible—it melts into your daily rhythm so you can focus on creating content, not clicking buttons.
            </p>

            <p className="mb-6">
              If that vision resonates, stay close. We'll be sharing progress openly and shipping fast. Together we can build the tool our industry has been waiting for.
            </p>

            <p className="mb-8">
              Thanks for reading, and for giving Bio a try. You can always contact me directly if you have any questions at <a href="mailto:alex@trybio.ai" className="text-blue-600 hover:underline">alex@trybio.ai</a>. I look forward to hearing from you.
            </p>

            <div className="flex flex-col items-start gap-4 mt-12 mb-8">
              <img 
                src={alexAvatar} 
                alt="Alex MacGregor" 
                className="w-32 h-32 object-cover"
              />
              <div className="text-left">
                <p className="font-semibold text-lg">— Alex MacGregor</p>
                <p className="text-muted-foreground">Founder, Bio</p>
                <a 
                  href="https://www.linkedin.com/in/alexmacgregor2/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-block mt-2"
                >
                  Connect with me on LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
