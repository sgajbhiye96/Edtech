import { useEffect, useState } from "react";
import API from "../services/api";

const blank = {
  course: "", name: "", start_date: "", end_date: "", max_students: 30,
  price: "", early_bird_price: "", registration_open: true, status: "UPCOMING",
};

const forms = {
  live: { title: "", description: "", scheduled_at: "", duration_minutes: 120, meeting_url: "", recording_url: "", recording_available: false },
  resource: { title: "", description: "", resource_type: "LINK", url: "" },
  assignment: { title: "", description: "", due_at: "", submission_url: "" },
  project: { title: "", description: "", repository_url: "" },
};

export default function Batches() {
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selected, setSelected] = useState("");
  const [batch, setBatch] = useState(blank);
  const [live, setLive] = useState(forms.live);
  const [resource, setResource] = useState(forms.resource);
  const [assignment, setAssignment] = useState(forms.assignment);
  const [project, setProject] = useState(forms.project);
  const [students, setStudents] = useState([]);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [c, b] = await Promise.all([API.get("/courses/"), API.get("/courses/batches/admin/")]);
      setCourses(c.data);
      setBatches(b.data);
    } catch {
      setError("Could not load admin data. Check that the current account is an administrator.");
    }
  };

  useEffect(() => { load(); }, []);

  const choose = async (id) => {
    setNotice(""); setError("");
    setSelected(id);
    const found = batches.find((item) => String(item.id) === String(id));
    setBatch(found ? { ...found, early_bird_price: found.early_bird_price || "" } : blank);
    if (id) {
      try {
        const response = await API.get(`/courses/batches/admin/${id}/students/`);
        setStudents(response.data);
      } catch {
        setStudents([]);
        setError("Could not load students for this batch.");
      }
    } else {
      setStudents([]);
    }
  };

  const saveBatch = async (event) => {
    event.preventDefault();
    setNotice(""); setError("");
    const payload = {
      ...batch,
      course: Number(batch.course),
      max_students: Number(batch.max_students),
      price: Number(batch.price),
      early_bird_price: batch.early_bird_price ? Number(batch.early_bird_price) : null,
    };
    try {
      if (selected) {
        await API.patch("/courses/batches/admin/" + selected + "/", payload);
        setNotice("Batch updated.");
      } else {
        await API.post("/courses/batches/admin/create/", payload);
        setNotice("Batch created.");
      }
      await load();
      setSelected("");
      setBatch(blank);
    } catch (err) {
      setError(JSON.stringify(err?.response?.data || "Could not save batch."));
    }
  };

  const addContent = async (kind, value, reset) => {
    if (!selected) {
      setError("Select an existing batch first.");
      return;
    }
    try {
      await API.post("/courses/" + kind + "/admin/create/", { ...value, batch: Number(selected) });
      reset();
      setNotice(kind.replace("-", " ") + " added.");
      setError("");
    } catch (err) {
      setError(JSON.stringify(err?.response?.data || "Could not add content."));
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-[#12172B]">Batches & Live Learning</h1>
        <p className="text-gray-600 mt-1">Manage cohorts, live classes and student learning content.</p>
      </header>

      {notice && <div className="p-3 rounded bg-green-50 border border-green-200 text-green-800">{notice}</div>}
      {error && <div className="p-3 rounded bg-red-50 border border-red-200 text-red-800">{error}</div>}

      <section className="bg-white p-6 rounded-xl shadow">
        <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-5">
          <h2 className="text-xl font-semibold">Cohort settings</h2>
          <select value={selected} onChange={(e) => choose(e.target.value)} className="border rounded p-2 md:w-96">
            <option value="">Create new batch</option>
            {batches.map((b) => <option key={b.id} value={b.id}>{b.course?.title || "Course"} — {b.name}</option>)}
          </select>
        </div>
        <form onSubmit={saveBatch} className="grid md:grid-cols-2 gap-4">
          <select required value={batch.course || ""} onChange={(e) => setBatch({ ...batch, course: e.target.value })} className="border rounded p-3">
            <option value="">Select course</option>
            {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          <input required placeholder="Batch name" value={batch.name || ""} onChange={(e) => setBatch({ ...batch, name: e.target.value })} className="border rounded p-3" />
          <input required type="date" value={batch.start_date || ""} onChange={(e) => setBatch({ ...batch, start_date: e.target.value })} className="border rounded p-3" />
          <input required type="date" value={batch.end_date || ""} onChange={(e) => setBatch({ ...batch, end_date: e.target.value })} className="border rounded p-3" />
          <input required type="number" min="1" value={batch.max_students || ""} onChange={(e) => setBatch({ ...batch, max_students: e.target.value })} placeholder="Maximum students" className="border rounded p-3" />
          <input required type="number" min="0" step="0.01" value={batch.price || ""} onChange={(e) => setBatch({ ...batch, price: e.target.value })} placeholder="Price" className="border rounded p-3" />
          <input type="number" min="0" step="0.01" value={batch.early_bird_price || ""} onChange={(e) => setBatch({ ...batch, early_bird_price: e.target.value })} placeholder="Early-bird price" className="border rounded p-3" />
          <select value={batch.status || "UPCOMING"} onChange={(e) => setBatch({ ...batch, status: e.target.value })} className="border rounded p-3">
            <option>UPCOMING</option><option>ONGOING</option><option>COMPLETED</option><option>CANCELLED</option>
          </select>
          <label className="flex items-center gap-2 p-3"><input type="checkbox" checked={Boolean(batch.registration_open)} onChange={(e) => setBatch({ ...batch, registration_open: e.target.checked })} /> Registration open</label>
          <button className="bg-[#12172B] text-white rounded p-3 font-semibold">{selected ? "Save batch" : "Create batch"}</button>
        </form>
      </section>

      {selected && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Content title="Live class" fields={live} setFields={setLive} fieldsConfig={[
            ["title", "Title", "text", true], ["description", "Description", "text", false],
            ["scheduled_at", "Scheduled at", "datetime-local", true], ["duration_minutes", "Duration", "number", true],
            ["meeting_url", "Meeting URL", "url", false], ["recording_url", "Recording URL", "url", false],
          ]} extra={<label className="flex gap-2"><input type="checkbox" checked={live.recording_available} onChange={(e) => setLive({ ...live, recording_available: e.target.checked })} /> Recording available</label>} onSubmit={(e) => { e.preventDefault(); addContent("live-classes", live, () => setLive(forms.live)); }} />
          <Content title="Resource" fields={resource} setFields={setResource} fieldsConfig={[["title","Title","text",true],["description","Description","text",false],["url","URL","url",false]]} extra={<select value={resource.resource_type} onChange={(e) => setResource({ ...resource, resource_type: e.target.value })} className="border rounded p-3 w-full"><option>LINK</option><option>FILE</option><option>NOTE</option></select>} onSubmit={(e) => { e.preventDefault(); addContent("resources", resource, () => setResource(forms.resource)); }} />
          <Content title="Assignment" fields={assignment} setFields={setAssignment} fieldsConfig={[["title","Title","text",true],["description","Description","text",false],["due_at","Due at","datetime-local",false],["submission_url","Submission URL","url",false]]} onSubmit={(e) => { e.preventDefault(); addContent("assignments", assignment, () => setAssignment(forms.assignment)); }} />
          <Content title="Project" fields={project} setFields={setProject} fieldsConfig={[["title","Title","text",true],["description","Description","text",false],["repository_url","Repository URL","url",false]]} onSubmit={(e) => { e.preventDefault(); addContent("projects", project, () => setProject(forms.project)); }} />
        </div>
      )}
    </div>
  );
}

function Content({ title, fields, setFields, fieldsConfig, extra, onSubmit }) {
  return (
    <section className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        {fieldsConfig.map(([key, label, type, required]) => (
          <input key={key} required={required} type={type} placeholder={label} value={fields[key] || ""} onChange={(e) => setFields({ ...fields, [key]: e.target.value })} className="border rounded p-3 w-full" />
        ))}
        {extra}
        <button className="bg-[#F2A93B] text-[#12172B] rounded p-3 w-full font-semibold">Add {title}</button>
      </form>
    </section>
  );
}
