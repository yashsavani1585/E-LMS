  import MediaProgressbar from "@/components/media-progress-bar";
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { InstructorContext } from "@/context/instructor-context";
  import { mediaUploadService } from "@/service";
  import { useContext } from "react";

  function CourseSettings() {
    const {
      courseLandingFormData,
      setCourseLandingFormData,
      mediaUploadProgress,
      setMediaUploadProgress,
      mediaUploadProgressPercentage,
      setMediaUploadProgressPercentage,
    } = useContext(InstructorContext);

    async function handleImageUploadChange(event) {
      const selectedImage = event.target.files[0];

      if (!selectedImage) return;

      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          imageFormData,
          setMediaUploadProgressPercentage
        );

        if (response.success) {
          setCourseLandingFormData((prev) => ({
            ...prev,
            image: response?.data?.media?.url || response?.data?.media||response.data?.url ,
          }));
        }
      } catch (error) {
        console.error("Image upload failed:", error);
      } finally {
        setMediaUploadProgress(false);
      }
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Course Settings</CardTitle>
        </CardHeader>
        <div className="p-4">
          {mediaUploadProgress && (
            <MediaProgressbar
              isMediaUploading={mediaUploadProgress}
              progress={mediaUploadProgressPercentage}
            />
          )}
        </div>
        <CardContent>
          {courseLandingFormData?.image ? (
            <img
              src={courseLandingFormData.image}
              alt="Course Thumbnail"
              className="w-full h-auto rounded-lg"
            />
          ) : (
            <div className="flex flex-col gap-3">
              <Label>Upload Course Image</Label>
              <Input
                onChange={handleImageUploadChange}
                type="file"
                accept="image/*"
              />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  export default CourseSettings;


