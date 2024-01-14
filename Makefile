timestamp=$(shell date +%s)

.PHONY: pack
pack:
	yarn build && yarn pack

.PHONY: link-expo
pack-expo:
	yarn build && yarn pack && \
	rm -f examples/expo/lib.tgz && cp *.tgz examples/expo/$(timestamp).tgz && cd examples/expo && yarn remove @hampfh/use-storage ; yarn add file:./$(timestamp).tgz && rm -f $(timestamp).tgz && cd ../..

.PHONY: link-react
pack-react:
	yarn build && yarn pack && \
	rm -f examples/react/lib.tgz && mv *.tgz examples/react/$(timestamp).tgz && cd examples/react && yarn remove @hampfh/use-storage ; yarn add file:./$(timestamp).tgz && rm -f $(timestamp).tgz && cd ../..