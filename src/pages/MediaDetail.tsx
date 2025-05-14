
import React from "react";
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

  console.log("MediaDetail - Render state:", { isLoading, media, formattedMedia, error });

  if (isLoading) {
    return (
      <Background>
        <MobileHeader />
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="w-full max-w-md px-4">
            <MediaDetailSkeleton />
          </div>
        </div>
      </Background>
    );
  }

  if (error || !media) {
    return <MediaErrorState error={error} onGoBack={handleGoBack} />;
  }

  // Protection supplémentaire - si formattedMedia est null malgré media présent
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
};

export default MediaDetail;
