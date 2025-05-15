
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Background } from "@/components/ui/background";
import { MobileHeader } from "@/components/mobile-header";
import { MediaDetailSkeleton } from "@/components/media-detail/media-loading-skeleton";
import { MediaErrorState } from "@/components/media-detail/media-error-state";
import { MediaFormatError } from "@/components/media-detail/media-format-error";
import { MediaDetailView } from "@/components/media-detail/media-detail-view";
import { useMediaDetail } from "@/hooks/use-media-detail";

const MediaDetail = () => {
  const navigate = useNavigate();
  const { 
    isLoading,
    media,
    error,
    formattedMedia,
    additionalInfo,
    type,
    id,
    previousPath,
    searchParams
  } = useMediaDetail();

  // Handler for navigating back
  const handleGoBack = () => {
    if (previousPath === "/recherche" && searchParams) {
      navigate({
        pathname: previousPath,
        search: searchParams
      }, { replace: true });
    } else {
      navigate(previousPath, { replace: true });
    }
  };

  // Effect for ensuring elements load correctly with page title
  useEffect(() => {
    if (formattedMedia?.title) {
      document.title = `${formattedMedia.title} | Mookka`;
    } else {
      document.title = "Détail du média | Mookka";
    }

    return () => {
      document.title = "Mookka";
    };
  }, [formattedMedia]);

  // Show skeleton during initial load
  if (isLoading && !media) {
    return (
      <Background>
        <MobileHeader />
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="w-full max-w-md px-4">
            <MediaDetailSkeleton />
          </div>
        </div>
      </Background>
    );
  }

  // Handle errors
  if (error || !media) {
    return <MediaErrorState error={error} onGoBack={handleGoBack} />;
  }

  // Additional protection - if formattedMedia is null despite media being present
  if (!formattedMedia || !id || !type) {
    return <MediaFormatError onGoBack={handleGoBack} />;
  }

  return (
    <MediaDetailView 
      id={id} 
      type={type} 
      media={media} 
      formattedMedia={formattedMedia} 
      additionalInfo={additionalInfo} 
    />
  );
}

export default MediaDetail;
