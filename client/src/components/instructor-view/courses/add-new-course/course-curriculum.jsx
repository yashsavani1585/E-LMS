import { useContext, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { InstructorContext } from "@/context/instructor-context";
import { mediaBulkUploadService, mediaDeleteService, mediaUploadService } from "@/service";
import { courseCurriculumInitialFormData } from "@/config";
import MediaProgressbar from "@/components/media-progress-bar";
import VideoPlayer from "@/components/video-player";
import { Upload } from "lucide-react";

function CourseCurriculum() {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  const bulkUploadInputRef= useRef(null)
  // Add a new lecture
  function handleNewLecture() {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
        ...courseCurriculumInitialFormData[0],
      },
    ]);
  }

  // Update lecture title
  function handleCourseTitleChange(event, index) {
    let updatedCurriculum = [...courseCurriculumFormData];
    updatedCurriculum[index].title = event.target.value;
    setCourseCurriculumFormData(updatedCurriculum);
  }

  // Toggle free preview option
  function handleFreePreviewChange(value, index) {
    let updatedCurriculum = [...courseCurriculumFormData];
    updatedCurriculum[index].freePreview = value;
    setCourseCurriculumFormData(updatedCurriculum);
  }

  // Delete lecture
  // function handleDeleteLecture(index) {
  //   let updatedCurriculum = [...courseCurriculumFormData];
  //   updatedCurriculum.splice(index, 1);
  //   setCourseCurriculumFormData(updatedCurriculum);
  // }

  // Handle video upload
  async function handleSingleLectureUpload(event, index) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const videoFormData = new FormData();
      videoFormData.append("file", selectedFile);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(videoFormData, setMediaUploadProgressPercentage);
        
        // Check if the upload was successful
        if (response.success) {
          let updatedFormData = [...courseCurriculumFormData];
          updatedFormData[index] = {
            ...updatedFormData[index],
            videoUrl: response?.data?.media?.secure_url||response?.data?.media?.url || response?.data?.url || response?.data?.secure_url, 
            public_id: response?.data?.public_id || response?.data?.media?.public_id,
          };
          setCourseCurriculumFormData(updatedFormData);

          // Log video URL for debugging
          console.log("Uploaded Video URL:", response?.data?.media?.secure_url);
        } else {
          console.error("Upload failed:", response?.message);
        }
      } catch (error) {
        console.error("Error uploading video:", error);
      } finally {
        setMediaUploadProgress(false); // Reset progress after upload is finished
      }
    }
  }

  async function handleReplaceVideo(currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const getCurrentVideoPublicId =
      cpyCourseCurriculumFormData[currentIndex].public_id;

    const deleteCurrentMediaResponse = await mediaDeleteService(
      getCurrentVideoPublicId
    );

    if (deleteCurrentMediaResponse?.success) {
      cpyCourseCurriculumFormData[currentIndex] = {
        ...cpyCourseCurriculumFormData[currentIndex],
        videoUrl: "",
        public_id: "",
      };

      setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }
  }

  function isCourseCurriculumFormDataValid() {
    return courseCurriculumFormData.every((item) => {
      return (
        item &&
        typeof item === "object" &&
        item.title?.trim() !== "" &&
        item.videoUrl?.trim() !== ""
      );
    });
  }
  

 function handleOpenBulkUploadDialog(){
   bulkUploadInputRef.current?.click();
 }

 function areAllCourseCurriculumFormDataObjectsEmpty(arr) {
  return arr.every((obj) => {
    return Object.entries(obj).every(([key, value]) => {
      if (typeof value === "boolean") {
        return true;
      }
      return value === "";
    });
  });
}

 async function handleMediaBulkUpload(event){
   const selectedFiles = Array.from(event.target.files);
   const bulkFormData = new FormData();
   selectedFiles.forEach((fileItem) => bulkFormData.append("files", fileItem));
   try {
     setMediaUploadProgress(true);
     const response = await mediaBulkUploadService(bulkFormData,setMediaUploadProgressPercentage)
     console.log(response, "bulk");
     if (response?.success) {
      let cpyCourseCurriculumFormdata = areAllCourseCurriculumFormDataObjectsEmpty(courseCurriculumFormData)?[]:[...courseCurriculumFormData];
      // console.log(cpyCourseCurriculumFormdata,"cpyCourseCurriculumFormdata");
      cpyCourseCurriculumFormdata = [
        ...cpyCourseCurriculumFormdata,
        ...response?.data?.map((item, index) => ({
          videoUrl: item?.secure_url || item?.url, // Use direct access
          public_id: item?.public_id,
          title: `Lecture ${cpyCourseCurriculumFormdata.length + (index + 1)}`,
          freePreview: false,
        })),
      ];
      
      setCourseCurriculumFormData(cpyCourseCurriculumFormdata);
      setMediaUploadProgress(false);
    }
   } catch (e) {
     console.log(e);
   }
 }

 async function handleDeleteLecture(currentIndex) {
  let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
  const getCurrentSelectedVideoPublicId =
    cpyCourseCurriculumFormData[currentIndex].public_id;

  const response = await mediaDeleteService(getCurrentSelectedVideoPublicId);

  if (response?.success) {
    cpyCourseCurriculumFormData = cpyCourseCurriculumFormData.filter(
      (_, index) => index !== currentIndex
    );

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }
}



  console.log(courseCurriculumFormData); // Log curriculum form data for debugging

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Create Course Curriculum</CardTitle>
        <div>
        <Input
        type="file"
        ref={bulkUploadInputRef}
        accept="video/*"
        multiple
        className="hidden"
        id="bulk-media-upload"
        onChange={handleMediaBulkUpload}
        />
        <Button as="label" htmlFor="bulk-media-upload" variant="outline" className="cursor-pointer" onClick={handleOpenBulkUploadDialog}>
          <Upload className="w-4 h-5 mr-2"/>
          Bulk Upload
        </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Button disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress} onClick={handleNewLecture}>Add Lecture</Button>
        {mediaUploadProgress && (
          <MediaProgressbar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        )}

        <div className="mt-4 space-y-4">
          {courseCurriculumFormData.map((curriculumItem, index) => (
            <div key={index} className="border p-5 rounded-md">
              <div className="flex gap-5 items-center">
                <h3 className="font-semibold">Lecture {index + 1}</h3>
                <Input
                  placeholder="Enter lecture title"
                  className="max-w-96"
                  onChange={(event) => handleCourseTitleChange(event, index)}
                  value={curriculumItem?.title || ""}
                />
                <div className="flex items-center space-x-2">
                  <Switch
                    onCheckedChange={(value) => handleFreePreviewChange(value, index)}
                    checked={curriculumItem?.freePreview || false}
                    id={`freePreview-${index + 1}`}
                  />
                  <Label htmlFor={`freePreview-${index + 1}`}>Free Preview</Label>
                </div>
              </div>

              <div className="mt-6">
                {curriculumItem.videoUrl ? (
                  <div className="flex gap-3 items-center">
                    <VideoPlayer 
                    url={curriculumItem?.videoUrl}
                    width="450px"
                    height="200px" 
                    />
                    <Button onClick={() => handleReplaceVideo(index)} className="bg-orange-600 text-white">
                      Replace Video
                    </Button>
                    <Button onClick={() => handleDeleteLecture(index)} className="bg-red-600 text-white">
                      Delete Lecture
                    </Button>
                  </div>
                ) : (
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={(event) => handleSingleLectureUpload(event, index)}
                    className="mb-4"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseCurriculum;
