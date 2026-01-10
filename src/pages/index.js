import ImageDisplay from "@/components/public/Images/ImageDisplay";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main className="flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Welcome</h1>
        
        <ImageDisplay
          src="/images/image_001.jpg"
          alt="Wedding image"
          animation="slide-up"
          width={600}
          height={400}
          className="rounded-lg shadow-lg"
          triggerOnScroll={false}
        />
      </main>
    </div>
  );
}
