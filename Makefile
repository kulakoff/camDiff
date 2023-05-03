.DEFAULT_GOAL := help

help: ## Help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-16s\033[0m %s\n", $$1, $$2}'

dev_start: ## start dev
	docker compose up -d && nf start

#TODO: kill npm start process
#dev_stop:
#	docker compose down && nf start

