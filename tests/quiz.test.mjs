import assert from "node:assert/strict";
import test from "node:test";
import { characters, questions, scoreQuiz } from "../app/quem-e-voce/quiz.ts";

// Caminhos construídos escolhendo atitudes próximas aos contextos do elenco.
const scenarios = {
  "Ana Luísa": "2132230112",
  Tiago: "1021011331",
  Isabela: "2302303122",
  Pedro: "0000111111",
  "Helô": "0021111301",
  "Magnólia": "2322302010",
  "Tião": "2312302220",
  Salete: "0221111001",
  "Jéssica": "1213021033",
  "Vitória": "2021112301",
  Luciane: "1223021033",
  "Élio": "2132330102",
  "Antônio": "0120121033",
  "Flávia": "3021110301",
  Camila: "1213022033",
};

const answers = (sequence) => [...sequence].map(Number);

test("ten questions, four options and exactly fifteen distinct results", () => {
  assert.equal(questions.length, 10);
  assert.ok(questions.every((question) => question.options.length === 4));
  assert.equal(characters.length, 15);
  assert.equal(new Set(characters.map((character) => character.id)).size, 15);
  assert.deepEqual(characters.map((c) => c.name), Object.keys(scenarios));
});

test("each distinct character wins a coherent complete path", () => {
  for (const [name, sequence] of Object.entries(scenarios)) {
    const result = scoreQuiz(answers(sequence));
    assert.equal(characters.find((character) => character.id === result.characterId).name, name, sequence);
    assert.ok(result.percentage >= 90 && result.percentage <= 98, `${name}: ${result.percentage}%`);
    assert.equal(result.bestQuestions.length, 2);
  }
});

test("different answers change the winner and compatibility is derived from scores", () => {
  const first = scoreQuiz(answers(scenarios.Pedro));
  const second = scoreQuiz(answers(scenarios["Magnólia"]));
  assert.notEqual(first.characterId, second.characterId);
  assert.notDeepEqual(first.scores, second.scores);
  assert.equal(first.percentage, Math.round(55 + 43 * first.scores[first.characterId] / 10));
});

test("tie-breaking is deterministic for repeated answers", () => {
  const sequence = answers("0000000000");
  const results = Array.from({ length: 10 }, () => scoreQuiz(sequence));
  assert.ok(results.every((result) => result.characterId === results[0].characterId && result.percentage === results[0].percentage));
});

test("partial and invalid choices cannot produce a result", () => {
  assert.throws(() => scoreQuiz([0, 1]), /dez respostas válidas/);
  assert.throws(() => scoreQuiz([4, ...Array(9).fill(0)]), /dez respostas válidas/);
  assert.throws(() => scoreQuiz(Array(10).fill(null)), /dez respostas válidas/);
});

test("seeded sample does not collapse to a few characters", () => {
  let seed = 119;
  const next = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 2 ** 32);
  const counts = Object.fromEntries(characters.map((character) => [character.id, 0]));
  for (let i = 0; i < 1200; i++) {
    counts[scoreQuiz(questions.map(() => Math.floor(next() * 4))).characterId]++;
  }
  assert.ok(Object.values(counts).every((count) => count >= 15), JSON.stringify(counts));
});
