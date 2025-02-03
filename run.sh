#!/bin/zsh

# Activate the virtual environment
source /home/asim/Documents/gitRepositories/MAD2Tutorial/.venv/bin/activate

# Run the main.py script in a new terminal
gnome-terminal -- zsh -c "source /home/asim/Documents/gitRepositories/MAD2Tutorial/.venv/bin/activate; python /home/asim/Documents/gitRepositories/MAD2Tutorial/main.py; exec zsh"

# Run the Celery worker in another new terminal
gnome-terminal -- zsh -c "source /home/asim/Documents/gitRepositories/MAD2Tutorial/.venv/bin/activate; celery -A main:celery_app worker --loglevel=INFO; exec zsh"

# Run mail hog smtp server
./MailHog
