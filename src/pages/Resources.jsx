import { useState, useEffect } from "react";
import { useHeaderData, usePageHeader } from "../context/HeaderContext";
import { resourcesData as fallbackResources } from "../data/dummyData";
import { Play, FileText, Globe, Eye } from "lucide-react";
import { api } from "../services/api";

export default function Resources() {
  const { goalLabel = "Backend Developer" } = useHeaderData();

  usePageHeader({
    pageTitle: "Resources",
    goalLabel,
  });

  const [activeTab, setActiveTab] = useState("youtube");
  const [items, setItems] = useState(fallbackResources.items);

  useEffect(() => {
    api.resources
      .getAll(activeTab)
      .then((res) => {
        if (res.resources && res.resources.length > 0) {
          setItems((prev) => ({
            ...prev,
            [activeTab]: res.resources,
          }));
        }
      })
      .catch((err) => {
        console.warn("Using offline resources fallback:", err.message);
      });
  }, [activeTab]);

  const getCategoryIcon = (id) => {
    switch (id) {
      case "youtube":
        return Play;
      case "docs":
        return FileText;
      case "articles":
        return Globe;
      default:
        return FileText;
    }
  };

  const currentItems = items[activeTab] || fallbackResources.items[activeTab] || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {fallbackResources.title}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {fallbackResources.subtitle}
        </p>
      </div>

      {/* Category Tabs */}
      <div className="inline-flex p-1.5 bg-gray-100/80 rounded-2xl gap-1">
        {fallbackResources.categories.map((cat) => {
          const Icon = getCategoryIcon(cat.id);
          const isActive = activeTab === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
              }`}
            >
              <Icon
                className={`h-4 w-4 ${
                  isActive ? "text-violet-600 fill-violet-600/20" : "text-gray-400"
                }`}
              />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.map((item, idx) => (
          <a
            key={item._id || item.id || idx}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-3xl border border-gray-100 bg-white overflow-hidden shadow-xs hover:shadow-md hover:border-violet-200 transition-all flex flex-col"
          >
            {/* Media Thumbnail Container */}
            <div className="relative aspect-video w-full bg-gradient-to-br from-violet-100/70 via-indigo-100/50 to-purple-100/80 flex items-center justify-center overflow-hidden">
              {/* Play Button Overlay */}
              <div className="h-14 w-14 rounded-full bg-red-500/80 group-hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                <Play className="h-6 w-6 fill-current ml-0.5" />
              </div>

              {/* Video Duration / Time Badge */}
              <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[11px] font-mono font-medium px-2 py-0.5 rounded-md backdrop-blur-xs">
                {item.duration || "15 mins"}
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 flex flex-col flex-1 justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-violet-600 tracking-wide">
                  {item.tag || "Resource"}
                </span>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-violet-600 transition-colors mt-1 line-clamp-2">
                  {item.title}
                </h3>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                <span className="font-medium text-gray-600">{item.author || "PathAI Curation"}</span>
                <div className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5 text-gray-400" />
                  <span>{item.views || "1.2k"}</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
