import { useFetchCertificateQuery } from "@/app/apis/certificateApi";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { assets } from "@/assets/assets";
import { Button } from "@/components/ui/button";
import { IoIosDocument } from "react-icons/io";
import { Loader2 } from "lucide-react";

const Certificate = () => {
  const { certificateID } = useParams();
  const { data, error, isLoading } = useFetchCertificateQuery(certificateID);
  const [certificateInfo, setCertificateInfo] = useState({});

  const certificateRef = useRef(null);

  useEffect(() => {
    if (data) {
      if (data?.success) {
        setCertificateInfo(data?.certificate);
      }
    } else if (error) {
      toast.error(
        error?.data?.message ||
          "Error in fetching the certificate information try again!"
      );
    }
  }, [data, error]);

  const handleDownloadCertificate = () => {
    const element = certificateRef.current;
    if (!element) {
      console.error("Certificate element not found");
      return;
    }

    // Set options for html2pdf
    const opt = {
      margin: 1,
      filename: `${certificateInfo?.courseID?.title}-Certificate.pdf`,
      image: { type: "png", quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    try {
      // Generate PDF and trigger download
      html2pdf()
        .from(element) // Get content from certificateRef
        .set(opt) // Set options
        .save() // Trigger download
        .catch((err) => {
          toast.error("Error generating certificate PDF.");
        });
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <section>
      {isLoading ? (
        <div className="flex justify-center my-8">
          <Loader2 className="w-8 h-8 animate-spin text-gray-800 dark:text-white" />
        </div>
      ) : (
        <section className="my-8 space-y-8 mx-3">
          <p className="text-xl sm:text-2xl md:text-3xl">
            Congratulations,{" "}
            <span className="font-bold">{certificateInfo?.userID?.name}</span>{" "}
            🎉 🎊
          </p>
          <div className="overflow-auto outline">
            <main className="min-w-[700px] p-4" ref={certificateRef}>
              <section>
                <div className="flex justify-between gap-3 mt-4 mb-16">
                  <div className="flex justify-between items-center">
                    <img
                      src={assets.logo_light}
                      className="w-[200px] dark:hidden"
                      alt="Company Logo"
                    />
                    <img
                      src={assets.logo_dark}
                      className="w-[200px] hidden dark:block"
                      alt="Company Logo"
                    />
                  </div>
                  <div className="text-xs">
                    <p>
                      Certificate ID : <span>{certificateInfo._id}</span>
                    </p>
                    <p>
                      Certificate URL :{" "}
                      <span>{certificateInfo?.certificate_url}</span>
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="font-medium">CERTIFICATE OF COMPLETION</p>
                  <p className="font-semibold text-xl sm:text-2xl md:text-3xl">
                    {certificateInfo?.courseID?.title}
                  </p>
                  <p>
                    Instructor{" "}
                    <span className="font-semibold text-lg">
                      {certificateInfo?.courseID?.creator?.name}
                    </span>
                  </p>
                </div>
                <div className="mt-20 mb-6">
                  <p className="text-2xl font-semibold">
                    {certificateInfo?.userID?.name}
                  </p>
                  <p>
                    Date{" "}
                    <span className="font-medium">
                      {new Date(certificateInfo?.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </p>
                </div>
              </section>
            </main>
          </div>
          <p>
            This certificate above verifies that{" "}
            <span className="text-[#F90070] font-medium">
              {certificateInfo?.userID?.name}
            </span>{" "}
            successfully completed the course{" "}
            <span className="text-[#F90070] font-medium">
              {certificateInfo?.courseID?.title}
            </span>{" "}
            on{" "}
            <span className="text-[#F90070] font-medium">
              {new Date(certificateInfo?.createdAt).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </span>{" "}
            as taught by{" "}
            <span className="text-[#F90070] font-medium">
              {certificateInfo?.courseID?.creator?.name}
            </span>{" "}
            on AcademIQ. The certificate indicates the entire course was
            completed as validated by the student.
          </p>
          <div className="my-8 flex justify-center">
            <Button
              className="bg-[#F90070] hover:bg-[#F90070] text-white cursor-pointer"
              onClick={handleDownloadCertificate}
            >
              <IoIosDocument size={16} />
              Download
            </Button>
          </div>
        </section>
      )}
    </section>
  );
};

export default Certificate;
