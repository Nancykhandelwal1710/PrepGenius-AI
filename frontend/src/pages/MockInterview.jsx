import { useState } from "react";
import axios from "axios";
import {
  Mic,
  Sparkles,
  CheckCircle,
  Target,
  Clock,
  ArrowRight,
  RotateCcw,
  Volume2,
  Radio,
} from "lucide-react";

const API_URL = import.meta.env.VITE_BACKEND_URL;

function MockInterview() {
  const [role, setRole] = useState("");
  const [resumeText, setResumeText] = useState(
    localStorage.getItem("resumeText") || ""
  );
  const [jobDescription, setJobDescription] = useState("");

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [improvements, setImprovements] = useState([]);

  const generateQuestions = async () => {
    if (!role.trim()) {
      alert("Please enter the role you are preparing for.");
      return;
    }

    try {
      setLoading(true);
      setQuestions([]);
      setCurrentIndex(0);
      setAnswer("");
      setFeedback(null);
      setScore(null);
      setImprovements([]);

      const response = await axios.post(
        `${API_URL}/generate-interview-questions`,
        {
          role,
          resume_text: resumeText,
          job_description: jobDescription,
        }
      );
      
      console.log(response.data);
      if (response.data.error) {
        alert(response.data.error);
        return;
      }

      setQuestions(response.data.questions || []);
    
    } catch (error) {
      console.error(error);
      alert("Could not generate questions right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const speakQuestion = () => {
    if (!questions[currentIndex]) return;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(questions[currentIndex]);
    speech.lang = "en-US";
    speech.rate = 0.9;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  };

  const startVoiceAnswer = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    setListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;


      

      setAnswer((prev) => {
        if (!prev) return transcript;
        return `${prev} ${transcript}`;
      });
    };

    recognition.onerror = (event) => {
      console.error(event.error);
      setListening(false);
      alert("Voice input stopped. Please try again.");
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      alert("Please answer the question first.");
      return;
    }

    try {

      setLoading(true);

      const response = await axios.post(
        `${API_URL}/evaluate-answer`,
        {
          question: questions[currentIndex],
          answer: answer,
        }
      );
      
      console.log(response.data);
      const result = response.data;
      
      console.log("FULL RESPONSE:", result);
      console.log("FEEDBACK OBJECT:", result.feedback);
      if (result.error) {
        setFeedback({
          feedback:
            "AI evaluation is temporarily unavailable because the Gemini API quota has been exceeded. Please try again in a minute.",
          technical_accuracy: 0,
          completeness: 0,
          communication: 0,
          confidence: 0,
          practical_example: 0,
          conciseness: 0,
          strengths: [],
          weaknesses: [],
          verdict: "Evaluation unavailable",
          ideal_answer: "",
          followup_question: "",
        });
        setScore(null);
        return;
      }
      
      setFeedback({
        feedback: result.feedback?.feedback || "",
        technical_accuracy: result.feedback?.technical_accuracy || 0,
        completeness: result.feedback?.completeness || 0,
        communication: result.feedback?.communication || 0,
        confidence: result.feedback?.confidence || 0,
        practical_example: result.feedback?.practical_example || 0,
        conciseness: result.feedback?.conciseness || 0,
        strengths: result.feedback?.strengths || [],
        weaknesses: result.feedback?.weaknesses || [],
        verdict: result.feedback?.verdict || "",
        ideal_answer: result.feedback?.ideal_answer || "",
        followup_question: result.feedback?.followup_question || "",
      });
      
      setImprovements(result.improvements || []);

      const totalScore =
        result.score ??
        result.overall_score ??
        result.feedback?.score ??
        0;

      setScore(totalScore);

      localStorage.setItem(
        "interviewScore",
        `${totalScore}/100`
      );

    } catch (err) {

      console.error(err);

      alert("Failed to evaluate answer.");

    } finally {

      setLoading(false);

    }

  };

  const nextQuestion = () => {
    setCurrentIndex(currentIndex + 1);
    setAnswer("");
    setFeedback(null);
    setScore(null);
    window.speechSynthesis.cancel();
  };

  const restartInterview = () => {
    setCurrentIndex(0);
    setAnswer("");
    setFeedback(null);
    setScore(null);
    window.speechSynthesis.cancel();
  };

  const progress =
    questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const completed =
    questions.length > 0 &&
    feedback !== null &&
    currentIndex === questions.length - 1;

  return (
    <div className="min-h-screen bg-[#FBFAF6] text-[#14213D] px-4 sm:px-6 py-8 md:py-10">
      <div className="max-w-7xl mx-auto">

        {/* Intro */}
        <section className="relative overflow-hidden bg-[#2457D6] text-white border-2 border-[#14213D] p-7 md:p-10 shadow-[8px_8px_0_#14213D]">
          <div className="absolute -right-8 -top-16 text-[11rem] font-black leading-none text-white/5">?</div>
          <div className="absolute right-8 bottom-6 text-5xl text-[#B8E34B] rotate-12">✦</div>

          <div className="relative grid lg:grid-cols-[1fr_280px] gap-8 items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#B8E34B]">
                Mock Interview Studio
              </p>
              <h1 className="mt-3 text-4xl md:text-6xl font-black tracking-[-0.056em] leading-[0.98]">
                Practice like it's
                <br />
                <span className="font-serif italic font-normal">the real thing.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-white/75 text-base md:text-lg leading-7">
                Speak your answer, hear the question, and get honest recruiter-style
                feedback. No pressure. Just practice.
              </p>
            </div>

            <div className="bg-white text-[#14213D] border-2 border-[#14213D] p-6 shadow-[5px_5px_0_#14213D] rotate-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black uppercase tracking-wider text-[#14213D]/50">Voice mode</p>
                <Radio size={20} className={listening ? "text-[#FF6B57] animate-pulse" : "text-[#2457D6]"} />
              </div>
              <p className="mt-3 text-3xl font-black">{listening ? "Listening…" : "Ready"}</p>
              <p className="mt-2 text-sm text-[#14213D]/55">Best in Chrome</p>
              <div className="mt-5 flex items-end gap-1 h-8">
                {[35,55,75,45,85,62,40,70].map((h,i)=>(
                  <span key={i} className={`flex-1 rounded-t-sm ${listening ? "bg-[#FF6B57]" : "bg-[#2457D6]/20"}`} style={{height:`${h}%`}} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Setup */}
        {questions.length === 0 && (
          <section className="grid lg:grid-cols-[0.72fr_1.28fr] gap-6 mt-8">
            <div className="bg-[#EEF3FF] border-2 border-[#14213D]/10 p-7 md:p-8">
              <p className="font-serif italic text-2xl text-[#2457D6]">Before you start</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight">
                Make it feel like your interview.
              </h2>
              <div className="mt-7 space-y-5">
                {[
                  "Listen to the question first.",
                  "Answer naturally, like you're talking to a recruiter.",
                  "Use one real project or experience.",
                  "Mention tools, decisions and impact.",
                  "Don't chase a perfect answer. Be clear."
                ].map((tip,index)=>(
                  <div key={index} className="flex gap-3">
                    <span className="shrink-0 w-7 h-7 rounded-full bg-white border border-[#2457D6]/20 text-[#2457D6] flex items-center justify-center font-black text-xs">
                      {index+1}
                    </span>
                    <p className="text-sm leading-6 text-[#14213D]/70">{tip}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-[#14213D]/10">
                <p className="text-sm font-bold">💡 Tip</p>
                <p className="mt-2 text-sm leading-6 text-[#14213D]/55">
                  Your resume is already loaded from Resume Analyzer when available,
                  so your questions can be more relevant to your experience.
                </p>
              </div>
            </div>

            <div className="bg-white border-2 border-[#14213D] p-7 md:p-8 shadow-[7px_7px_0_#B8E34B]">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="font-serif italic text-xl text-[#FF6B57]">Let's set the scene</p>
                  <h2 className="mt-1 text-3xl md:text-4xl font-black tracking-[-0.04em]">
                    Who are you interviewing for?
                  </h2>
                </div>
                <span className="hidden sm:block text-4xl">🎤</span>
              </div>

              <label className="block text-sm font-bold mt-8 mb-2">Target role</label>
              <input
                type="text"
                placeholder="e.g. AI/ML Engineer, Python Developer Intern"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border-2 border-[#14213D]/15 rounded-xl p-4 outline-none focus:border-[#2457D6] focus:ring-4 focus:ring-[#2457D6]/10 transition"
              />

              <label className="block text-sm font-bold mt-6 mb-2">Resume text</label>
              <textarea
                rows="5"
                placeholder="Resume text appears here if you used Resume Analyzer first."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="w-full border-2 border-[#14213D]/15 rounded-xl p-4 text-sm outline-none focus:border-[#2457D6] focus:ring-4 focus:ring-[#2457D6]/10 transition"
              />

              <label className="block text-sm font-bold mt-6 mb-2">Job description</label>
              <textarea
                rows="5"
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full border-2 border-[#14213D]/15 rounded-xl p-4 text-sm outline-none focus:border-[#2457D6] focus:ring-4 focus:ring-[#2457D6]/10 transition"
              />

              <button
                onClick={generateQuestions}
                disabled={loading}
                className="mt-6 w-full bg-[#14213D] text-white px-8 py-4 rounded-xl font-black hover:bg-[#2457D6] disabled:bg-slate-400 transition-colors inline-flex items-center justify-center gap-3"
              >
                {loading ? "Preparing your questions…" : "Start Mock Interview"}
                {!loading && <ArrowRight size={19} />}
              </button>
            </div>
          </section>
        )}

        {/* Interview */}
        {questions.length > 0 && (
          <section className="mt-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
              <div>
                <p className="font-serif italic text-xl text-[#2457D6]">
                  Question {currentIndex + 1} of {questions.length}
                </p>
                <h2 className="mt-1 text-3xl md:text-4xl font-black tracking-[-0.04em]">
                  Tell your story.
                </h2>
              </div>
              <div className="text-sm text-[#14213D]/50 flex items-center gap-2">
                <Clock size={17} />
                Speak clearly and naturally
              </div>
            </div>

            <div className="h-3 bg-[#E5E9F1] overflow-hidden mb-7">
              <div className="h-full bg-[#2457D6] transition-all" style={{width:`${progress}%`}} />
            </div>

            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
              <div>
                <div className="relative bg-[#14213D] text-white border-2 border-[#14213D] p-7 md:p-9 shadow-[7px_7px_0_#2457D6]">
                  <div className="absolute -top-3 left-8 bg-[#FF6B57] text-white px-4 py-1 text-xs font-black rotate-[-2deg]">
                    INTERVIEW QUESTION
                  </div>
                  <p className="mt-4 text-2xl md:text-3xl leading-[1.35] font-bold tracking-[-0.02em]">
                    {questions[currentIndex]}
                  </p>

                  <button
                    onClick={speakQuestion}
                    className="mt-8 bg-white text-[#14213D] px-5 py-3 rounded-xl font-black inline-flex items-center gap-2 hover:bg-[#B8E34B] transition-colors"
                  >
                    <Volume2 size={18} />
                    Hear question
                  </button>
                </div>

                <div className="mt-6 bg-white border-2 border-[#14213D]/10 p-6">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <label className="text-sm font-black">Your answer</label>
                    <span className="text-xs text-[#14213D]/45">{answer.length} characters</span>
                  </div>

                  <textarea
                    rows="9"
                    placeholder="Speak your answer or type/edit it here…"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="w-full border-2 border-[#14213D]/10 rounded-xl p-4 text-sm leading-7 outline-none focus:border-[#2457D6] focus:ring-4 focus:ring-[#2457D6]/10 transition"
                  />

                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className={`text-sm font-bold flex items-center gap-2 ${listening ? "text-[#FF6B57]" : "text-[#14213D]/45"}`}>
                      <span className={`h-2.5 w-2.5 rounded-full ${listening ? "bg-[#FF6B57] animate-pulse" : "bg-[#14213D]/20"}`} />
                      {listening ? "Listening to you…" : "Ready to listen"}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={startVoiceAnswer}
                        className="bg-[#2457D6] text-white px-5 py-3 rounded-xl font-black hover:bg-[#14213D] transition-colors inline-flex items-center gap-2"
                      >
                        <Radio size={18} />
                        {listening ? "Listening…" : "Start Speaking"}
                      </button>

                      <button
                        onClick={submitAnswer}
                        disabled={loading}
                        className="bg-[#B8E34B] text-[#14213D] px-5 py-3 rounded-xl font-black border-2 border-[#14213D] hover:bg-white disabled:opacity-60 transition-colors"
                      >
                        {loading ? "Evaluating…" : "Submit Answer"}
                      </button>

                      {feedback && currentIndex < questions.length - 1 && (
                        <button
                          onClick={nextQuestion}
                          className="bg-[#14213D] text-white px-5 py-3 rounded-xl font-black inline-flex items-center gap-2 hover:bg-[#2457D6] transition-colors"
                        >
                          Next <ArrowRight size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <aside className="space-y-5">
                <div className="bg-[#F1F7D9] border-2 border-[#14213D]/10 p-6">
                  <p className="font-serif italic text-xl text-[#648400]">Quick reminder</p>
                  <h3 className="mt-1 text-2xl font-black">Don't sound rehearsed.</h3>
                  <p className="mt-3 text-sm leading-6 text-[#14213D]/60">
                    Explain your thinking. A clear, genuine answer is more useful than a memorized paragraph.
                  </p>
                </div>

                <div className="bg-white border-2 border-[#14213D]/10 p-6">
                  <div className="flex items-center gap-3">
                    <Target className="text-[#2457D6]" />
                    <h3 className="text-xl font-black">Your goal</h3>
                  </div>
                  <div className="mt-5 space-y-3 text-sm">
                    {["Answer the question", "Give evidence", "Explain your impact"].map((x,i)=>(
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle size={18} className="text-[#2457D6]" />
                        <span className="text-[#14213D]/65">{x}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>

            {feedback !== null && (
              <div className="mt-10">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-5">
                  <div>
                    <p className="font-serif italic text-xl text-[#FF6B57]">You finished the answer.</p>
                    <h2 className="mt-1 text-3xl md:text-4xl font-black tracking-[-0.04em]">
                      Here's what the recruiter saw.
                    </h2>
                  </div>

                  <div className="bg-[#2457D6] text-white px-7 py-5 border-2 border-[#14213D] shadow-[5px_5px_0_#B8E34B] text-center rotate-1">
                    <p className="text-xs font-black uppercase tracking-wider text-white/65">Overall score</p>
                    <p className="text-5xl font-black leading-none mt-1">{score}<span className="text-lg text-white/60">/100</span></p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-[1.35fr_0.65fr] gap-6">
                  <div className="bg-white border-2 border-[#14213D]/10 p-7 md:p-8">
                    {feedback?.feedback && (
                      <div className="bg-[#EEF3FF] border-l-4 border-[#2457D6] p-5 mb-7">
                        <p className="text-xs font-black uppercase tracking-wider text-[#2457D6]">Recruiter's feedback</p>
                        <p className="mt-2 leading-7 text-[#14213D]/75 whitespace-pre-wrap">{feedback.feedback}</p>
                      </div>
                    )}

                    <h3 className="text-2xl font-black">Your scorecard</h3>
                    <div className="grid sm:grid-cols-2 gap-3 mt-5">
                      {[
                        ["Technical Accuracy", Math.round((feedback?.technical_accuracy / 4) * 40), 40],
                        ["Completeness", Math.round((feedback?.completeness / 2) * 20), 20],
                        ["Communication", Math.round((feedback?.communication / 2) * 15), 15],
                        ["Confidence", Math.round(feedback?.confidence * 10), 10],
                        ["Practical Example", Math.round(feedback?.practical_example * 10), 10],
                        ["Conciseness", Math.round(feedback?.conciseness * 5), 5],
                      ].map(([label,value,max])=>(
                        <div key={label} className="border border-[#14213D]/10 p-4">
                          <div className="flex justify-between gap-3">
                            <span className="text-sm font-bold">{label}</span>
                            <span className="font-black text-[#2457D6]">{value}/{max}</span>
                          </div>
                          <div className="mt-3 h-2 bg-[#E7EAF0]">
                            <div className="h-full bg-[#2457D6]" style={{width:`${max ? (value/max)*100 : 0}%`}} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid md:grid-cols-2 gap-7 mt-8 pt-7 border-t border-[#14213D]/10">
                      <div>
                        <h4 className="text-lg font-black flex items-center gap-2">
                          <span className="text-[#648400]">✓</span> Strengths
                        </h4>
                        <ul className="mt-3 space-y-2 text-sm leading-6 text-[#14213D]/65">
                          {feedback?.strengths?.map((item,index)=><li key={index}>• {item}</li>)}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-black flex items-center gap-2">
                          <span className="text-[#FF6B57]">!</span> Weaknesses
                        </h4>
                        <ul className="mt-3 space-y-2 text-sm leading-6 text-[#14213D]/65">
                          {feedback?.weaknesses?.map((item,index)=><li key={index}>• {item}</li>)}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-8 grid md:grid-cols-2 gap-5">
                      <div className="bg-[#FFF0EC] p-5 border border-[#FF6B57]/20">
                        <p className="text-xs font-black uppercase tracking-wider text-[#D94A39]">Recruiter verdict</p>
                        <p className="mt-2 text-xl font-black">{feedback?.verdict || "No verdict available."}</p>
                      </div>
                      <div className="bg-[#F1F7D9] p-5 border border-[#B8E34B]/50">
                        <p className="text-xs font-black uppercase tracking-wider text-[#648400]">Next improvement</p>
                        <p className="mt-2 text-sm leading-6 text-[#14213D]/70">
                          {improvements?.[0] || "Keep your answer specific and evidence-based."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {feedback?.ideal_answer && (
                      <div className="bg-[#14213D] text-white p-7 border-2 border-[#14213D] shadow-[5px_5px_0_#2457D6]">
                        <p className="text-xs font-black uppercase tracking-wider text-[#B8E34B]">Ideal answer</p>
                        <p className="mt-4 leading-7 text-white/75 whitespace-pre-wrap">{feedback.ideal_answer}</p>
                      </div>
                    )}

                    {feedback?.followup_question && (
                      <div className="bg-[#EEF3FF] border-2 border-[#14213D]/10 p-7">
                        <p className="font-serif italic text-xl text-[#2457D6]">Recruiter follow-up</p>
                        <p className="mt-3 text-lg font-bold leading-7">{feedback.followup_question}</p>
                      </div>
                    )}

                    {improvements.length > 0 && (
                      <div className="bg-white border-2 border-[#14213D]/10 p-7">
                        <p className="text-xl font-black">Suggested improvements</p>
                        <ul className="mt-4 space-y-3 text-sm leading-6 text-[#14213D]/65">
                          {improvements.map((item,index)=><li key={index}>→ {item}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {completed && (
              <div className="mt-8 bg-[#B8E34B] border-2 border-[#14213D] p-7 md:p-9 shadow-[7px_7px_0_#14213D]">
                <p className="font-serif italic text-xl">You did it.</p>
                <h3 className="mt-1 text-4xl font-black tracking-[-0.04em]">
                  Interview complete 🎉
                </h3>
                <p className="mt-3 max-w-2xl text-[#14213D]/65 leading-7">
                  You completed all generated questions. Try another role or job description
                  and see how your answers improve.
                </p>
                <button
                  onClick={restartInterview}
                  className="mt-6 bg-[#14213D] text-white px-6 py-3 rounded-xl font-black inline-flex items-center gap-2 hover:bg-[#2457D6] transition-colors"
                >
                  <RotateCcw size={18} />
                  Practice Again
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default MockInterview;
