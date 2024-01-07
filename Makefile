timestamp=$(shell date +%s)
pack:
	yarn build && yarn pack && \
	rm -f examples/expo/lib.tgz && mv *.tgz examples/expo/$(timestamp).tgz && cd examples/expo && yarn remove @hampfh/use-storage ; yarn add file:./$(timestamp).tgz && rm -f $(timestamp).tgz && cd ../.. && \
	rm -f examples/react/lib.tgz && mv *.tgz examples/expo/$(timestamp).tgz && cd examples/react && yarn remove @hampfh/use-storage ; yarn add file:./$(timestamp).tgz && rm -f $(timestamp).tgz && cd ../..
