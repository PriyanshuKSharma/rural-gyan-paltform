all: build

build:
	pdflatex digital-learning-paper.tex
	bibtex digital-learning-paper || true
	pdflatex digital-learning-paper.tex
	pdflatex digital-learning-paper.tex

clean:
	rm -f *.aux *.bbl *.blg *.log *.out *.toc *.lof *.lot *.gz *.idx *.ilg *.ind
