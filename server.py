from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()
app.mount("/static", StaticFiles(directory="static", html=True), name="static")

origins = ["http://localhost", "http://localhost:8000", "http://127.0.0.1:5500"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def findall(p, s):
    i = s.find(p)
    while i != -1:
        yield i
        i = s.find(p, i + 1)


def check_word(
    word: str, good_letters: str, out_of_place_letters: str, bad_letters: str
):
    for bad_letter in bad_letters:
        if bad_letter in word:
            return False
    for letter, position in good_letters:
        if word[position - 1] != letter:
            return False
    for letter, position in out_of_place_letters:
        if word[position - 1] == letter or letter not in word:
            return False
        letter_positions = [x + 1 for x in list(findall(letter, word))]
        current_good_l_pos = [x[1] for x in good_letters if x[0] == letter]
        # remove all positions that are already in good_letters
        letter_positions = [x for x in letter_positions if x not in current_good_l_pos]
        if not letter_positions:
            return False

    return True


def sanitize_input(good_letters: str, out_of_place_letters: str, bad_letters: str):
    good_letters = (
        [(x[0], int(x[1])) for x in good_letters.split(",")] if good_letters else []
    )
    out_of_place_letters = (
        [(x[0], int(x[1])) for x in out_of_place_letters.split(",")]
        if out_of_place_letters
        else []
    )
    bad_letters = bad_letters.split(",") if bad_letters else []
    return good_letters, out_of_place_letters, bad_letters


@app.get("/")
def read_root():
    return FileResponse("index.html", media_type="text/html")


# "words" endpoint. should receive word lenght, letters with position and letters not present
# and return a list of words that match the criteria
@app.get("/api/v1/words")
def get_words(
    length: int, good_letters: str, out_of_place_letters: str, bad_letters: str
):
    with open(f"words/parole_{length}.txt", "r") as f:
        parole = f.read().splitlines()
    try:
        good_letters, out_of_place_letters, bad_letters = sanitize_input(
            good_letters, out_of_place_letters, bad_letters
        )
    except Exception as e:
        return {"words": [], "error": f"bad request. {e}"}
    good_words = []
    for parola in parole:
        if check_word(parola, good_letters, out_of_place_letters, bad_letters):
            good_words.append(parola)
    return {"words": good_words}
