// LessonForge API — POST {grade, subject, topic} → lesson opening + objectives + discussion
var API_KEY = 'sk-XvsPGPNB59jInCrjPuXcCFBl3r68KIjQuKrMgUYgzEEh2nmp';
var API_URL = 'https://api.yairouter.com/v1/chat/completions';
var MODEL = 'gpt-4o-mini';

function doPost(e) {
  var out = { ok: false };
  try {
    var body = JSON.parse(e.postData.contents || '{}');
    var grade = body.grade || 'Grade 7';
    var subject = body.subject || 'History';
    var topic = String(body.topic || '').slice(0, 120);
    if (!topic) throw new Error('topic required');

    var system = [
      'You are a veteran middle-school teacher who writes lesson OPENINGS in a spoken, storytelling voice.',
      'Rules:',
      '1) Open with a concrete scene: a person, a date, a mystery — never "Today we will learn".',
      '2) 120-160 words. Spoken rhythm. Include one pause point written as (pause — ask students…).',
      '3) End with the hook question that leads into the lesson.',
      '4) Then add: OBJECTIVES: with 3 bullet objectives, and DISCUSS: with 2 questions (one recall, one open).',
      '5) No em-dashes, no "delve", no AI clichés. Write like a person talking to 12-year-olds.'
    ].join('\n');

    var payload = {
      model: MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: 'Grade: ' + grade + '\nSubject: ' + subject + '\nTopic: ' + topic + '\nWrite the lesson opening + objectives + discussion questions.' }
      ],
      temperature: 0.8,
      max_tokens: 700
    };
    var resp = UrlFetchApp.fetch(API_URL, {
      method: 'post',
      contentType: 'application/json',
      headers: { Authorization: 'Bearer ' + API_KEY },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    var code = resp.getResponseCode();
    var text = resp.getContentText();
    if (code !== 200) throw new Error('LLM API ' + code + ': ' + text.slice(0, 120));
    var json = JSON.parse(text);
    out = { ok: true, text: json.choices[0].message.content };
  } catch (err) {
    out = { ok: false, error: String(err).slice(0, 200) };
  }
  // text/plain 避免 CORS 预检
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.TEXT);
}

function testAuth() {
  var r = UrlFetchApp.fetch('https://api.yairouter.com/v1/models', { muteHttpExceptions: true });
  return 'auth ok, status ' + r.getResponseCode();
}
