import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const tabs = ["Overview", "Live Classes", "Recordings", "Resources", "Assignments", "Projects"];

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/enrollments/dashboard/")
      .then((res) => setData(res.data))
      .catch(() => setError("We couldn't load your learning dashboard. Please sign in again or try again."));
  }, []);

  const activeEnrollment = data?.enrollments?.[0];
  const progress = activeEnrollment?.progress || { completed: 0, total: 0, percent: 0 };
  const nextClass = data?.next_live_class;

  const content = useMemo(() => {
    if (!data) return null;
    if (activeTab === "Live Classes") return data.live_classes || [];
    if (activeTab === "Recordings") return data.recordings || [];
    if (activeTab === "Resources") return data.resources || [];
    if (activeTab === "Assignments") return data.assignments || [];
    if (activeTab === "Projects") return data.projects || [];
    return [];
  }, [activeTab, data]);

  if (error) {
    return <div className="min-h-screen bg-[#F6F4ED] p-8 text-center text-[#8A2C2C]">{error}</div>;
  }

  if (!data) {
    return <div className="min-h-screen bg-[#F6F4ED] p-10 text-center text-[#9AA3CC]">Loading your classroom...</div>;
  }

  if (!data.enrollments?.length) {
    return (
      <div className="min-h-screen bg-[#F6F4ED] px-6 py-16 font-['Inter',sans-serif]">
        <div className="mx-auto max-w-3xl bg-white border border-[#E4E0D2] rounded-md p-8 text-center">
          <h1 className="font-['Sora',sans-serif] text-3xl font-bold text-[#12172B] mb-3">Your classroom is waiting</h1>
          <p className="text-[#2B3252] mb-6">You don't have an active batch enrollment yet.</p>
          <Link to="/courses" className="inline-block bg-[#F2A93B] text-[#12172B] px-6 py-3 rounded-[3px] font-bold">Browse live courses</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F4ED] px-4 md:px-8 py-8 font-['Inter',sans-serif]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-7">
          <p className="text-sm text-[#6B7280]">Student dashboard</p>
          <h1 className="font-['Sora',sans-serif] text-2xl md:text-4xl font-bold text-[#12172B] mt-1">
            Welcome back, {data.profile.username}
          </h1>
        </div>

        <div className="bg-[#12172B] text-white rounded-md p-6 md:p-8 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-[#9AA3CC] text-sm mb-2">Your live cohort</p>
              <h2 className="font-['Sora',sans-serif] text-xl md:text-2xl font-bold">{activeEnrollment.course.title}</h2>
              <p className="text-[#D6DAEA] mt-2">{activeEnrollment.batch.name} · {activeEnrollment.batch.start_date} → {activeEnrollment.batch.end_date}</p>
            </div>
            <div className="min-w-[220px]">
              <div className="flex justify-between text-sm mb-2"><span>Course progress</span><span>{progress.percent}%</span></div>
              <div className="h-2 bg-white/15 rounded-full overflow-hidden"><div className="h-full bg-[#F2A93B]" style={{ width: `${progress.percent}%` }} /></div>
              <p className="text-xs text-[#9AA3CC] mt-2">{progress.completed} of {progress.total} lessons completed</p>
            </div>
          </div>
        </div>

        {nextClass && (
          <div className="bg-white border border-[#E4E0D2] rounded-md p-5 md:p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-[#F2A93B]">Next live class</p>
                <h2 className="font-['Sora',sans-serif] text-xl font-bold text-[#12172B] mt-1">{nextClass.title}</h2>
                <p className="text-[#2B3252] mt-1">{formatDate(nextClass.scheduled_at)} · {nextClass.duration_minutes} min</p>
              </div>
              {nextClass.meeting_url ? (
                <a href={nextClass.meeting_url} target="_blank" rel="noreferrer" className="bg-[#F2A93B] text-[#12172B] px-5 py-3 rounded-[3px] font-bold text-center">Join class</a>
              ) : <span className="text-sm text-[#9AA3CC]">Meeting link will be added soon.</span>}
            </div>
          </div>
        )}

        <div className="bg-white border border-[#E4E0D2] rounded-md overflow-hidden">
          <div className="flex gap-1 overflow-x-auto border-b border-[#E4E0D2] p-2">
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-[3px] text-sm whitespace-nowrap ${activeTab === tab ? "bg-[#12172B] text-white font-semibold" : "text-[#2B3252] hover:bg-[#F6F4ED]"}`}>
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Overview" ? (
            <div className="grid md:grid-cols-2 gap-5 p-6">
              <section><h3 className="font-['Sora',sans-serif] font-bold text-[#12172B] mb-3">What to do next</h3><ul className="space-y-2 text-sm text-[#2B3252]"><li>• Attend the next live class.</li><li>• Review the latest recording after class.</li><li>• Check assignments and project work.</li></ul></section>
              <section><h3 className="font-['Sora',sans-serif] font-bold text-[#12172B] mb-3">Learning access</h3><p className="text-sm text-[#2B3252]">Your content is scoped to your active batch. You will only receive classes, recordings, resources, assignments and projects for enrolled batches.</p></section>
            </div>
          ) : content.length === 0 ? (
            <div className="p-10 text-center text-sm text-[#9AA3CC]">Nothing has been added here yet.</div>
          ) : (
            <div className="divide-y divide-[#EDEAE0]">
              {content.map((item) => (
                <div key={item.id} className="p-5 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <h3 className="font-['Sora',sans-serif] font-bold text-[#12172B]">{item.title}</h3>
                      {item.description && <p className="text-sm text-[#2B3252] mt-1 max-w-3xl">{item.description}</p>}
                      {item.scheduled_at && <p className="text-xs text-[#6B7280] mt-2">{formatDate(item.scheduled_at)}</p>}
                      {item.due_at && <p className="text-xs text-[#6B7280] mt-2">Due: {formatDate(item.due_at)}</p>}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {activeTab === "Live Classes" && item.meeting_url && <a href={item.meeting_url} target="_blank" rel="noreferrer" className="border border-[#12172B] px-4 py-2 rounded-[3px] text-sm font-semibold text-[#12172B]">Join</a>}
                      {activeTab === "Recordings" && item.recording_url && <a href={item.recording_url} target="_blank" rel="noreferrer" className="bg-[#12172B] text-white px-4 py-2 rounded-[3px] text-sm font-semibold">Watch</a>}
                      {activeTab === "Resources" && item.url && <a href={item.url} target="_blank" rel="noreferrer" className="border border-[#12172B] px-4 py-2 rounded-[3px] text-sm font-semibold text-[#12172B]">Open</a>}
                      {activeTab === "Assignments" && item.submission_url && <a href={item.submission_url} target="_blank" rel="noreferrer" className="bg-[#F2A93B] text-[#12172B] px-4 py-2 rounded-[3px] text-sm font-semibold">Submit</a>}
                      {activeTab === "Projects" && item.repository_url && <a href={item.repository_url} target="_blank" rel="noreferrer" className="border border-[#12172B] px-4 py-2 rounded-[3px] text-sm font-semibold text-[#12172B]">Open repo</a>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
